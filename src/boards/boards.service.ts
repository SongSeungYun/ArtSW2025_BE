import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import { BoardCommentRepository } from './repositories/board-comment.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryBoardDto } from './dto/query-board.dto';
import { DataSource } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardImage } from './entities/board-image.entity';
import { BoardComment } from './entities/board-comment.entity';
import { UploadService } from './upload.service';

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardImageRepository: BoardImageRepository,
    private readonly boardCommentRepository: BoardCommentRepository,
    private readonly dataSource: DataSource,
    private readonly uploadService: UploadService,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const boardData = { ...createBoardDto, user_id: userId };
      const board = await queryRunner.manager.save(Board, boardData);

      if (files && files.length > 0) {
        const imageUrls = await this.uploadService.uploadFiles(files);
        const imageEntities = imageUrls.map((url, index) => {
          return queryRunner.manager.create(BoardImage, {
            board_id: board.board_id,
            image_url: url,
            sort_order: index + 1,
          });
        });
        await queryRunner.manager.save(imageEntities);
      }

      await queryRunner.commitTransaction();

      const newBoard = await queryRunner.manager.findOne(Board, {
        where: { board_id: board.board_id },
        relations: ['images', 'comments', 'user'],
      });
      
      return newBoard;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('--- Transaction Error in createBoard (manual) ---', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getBoards(queryBoardDto: QueryBoardDto) {
    const { board_type, page = '1', limit = '20' } = queryBoardDto;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = this.boardRepository.createQueryBuilder('board');

    if (board_type) {
      query.where('board.board_type = :board_type', { board_type });
    }

    const [boards, total] = await query
      .orderBy('board.created_at', 'DESC')
      .skip(skip)
      .take(limitNum)
      .getManyAndCount();

    return {
      boards,
      total,
      page: pageNum,
      lastPage: Math.ceil(total / limitNum),
    };
  }

  async getBoardById(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { board_id: boardId },
      relations: ['images', 'comments', 'user'],
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    return board;
  }

  async findRecentGalleries(): Promise<Board[]> {
    return this.boardRepository.findRecentGalleryBoards();
  }

  async updateBoard(boardId: number, updateBoardDto: UpdateBoardDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = await this.boardRepository.findOne({
          where: { board_id: boardId },
          relations: ['images'],
      });

      if (!board) {
        throw new NotFoundException(`Board with ID ${boardId} not found`);
      }
      if (board.user_id !== userId) {
        throw new ForbiddenException('You are not authorized to update this board.');
      }

      const { images, ...boardData } = updateBoardDto;
      
      if (Object.keys(boardData).length > 0) {
        await queryRunner.manager.update(Board, boardId, boardData);
      }

      if (images) {
        const incomingImageIds = images.map(img => img.image_id).filter(id => id);

        const imagesToDelete = board.images.filter(
          (existingImage) => !incomingImageIds.includes(existingImage.image_id),
        );

        if (imagesToDelete.length > 0) {
          await queryRunner.manager.remove(imagesToDelete);
        }

        const imageEntities = images.map((imageDto) => {
          return this.boardImageRepository.create({
            ...imageDto,
            board_id: boardId,
          });
        });
        
        if (imageEntities.length > 0) {
            await queryRunner.manager.save(imageEntities);
        }
      }

      await queryRunner.commitTransaction();
      return this.getBoardById(boardId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteBoard(boardId: number, userId: string) {
    const board = await this.boardRepository.findOne({ where: { board_id: boardId } });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this board.');
    }
    const result = await this.boardRepository.delete(boardId);
    if (result.affected === 0) {
        throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    return { success: true, message: '게시글이 삭제되었습니다.' };
  }

  async createComment(boardId: number, createCommentDto: CreateCommentDto, userId: string) {
    const board = await this.boardRepository.findOne({ where: { board_id: boardId } });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    const comment = this.boardCommentRepository.create({
      ...createCommentDto,
      board_id: boardId,
      user_id: userId,
    });
    return this.boardCommentRepository.save(comment);
  }

  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.boardCommentRepository.findOne({ where: { comment_id: commentId } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You are not authorized to update this comment.');
    }
    await this.boardCommentRepository.update(commentId, updateCommentDto);
    return this.boardCommentRepository.findOne({ where: { comment_id: commentId } });
  }

  async deleteComment(commentId: number, userId: string) {
    const comment = await this.boardCommentRepository.findOne({ where: { comment_id: commentId } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment.');
    }
    const result = await this.boardCommentRepository.delete(commentId);
    if (result.affected === 0) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return { success: true, message: '댓글이 삭제되었습니다.' };
  }
}
