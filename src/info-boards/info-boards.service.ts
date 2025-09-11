import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InfoBoardRepository } from './repositories/info-board.repository';
import { CreateInfoBoardDto } from './dto/create-info-board.dto';
import { InfoBoard } from './entities/info-board.entity';
import { UpdateInfoBoardDto } from './dto/update-info-board.dto';
import { InfoBoardCommentRepository } from './repositories/info-board-comment.repository';
import { CreateInfoBoardCommentDto } from './dto/create-info-board-comment.dto';
import { UpdateInfoBoardCommentDto } from './dto/update-info-board-comment.dto';
import { InfoBoardComment } from './entities/info-board-comment.entity';
import { QueryInfoBoardDto } from './dto/query-info-board.dto';

@Injectable()
export class InfoBoardsService {
  constructor(
    private readonly infoBoardRepository: InfoBoardRepository,
    private readonly infoBoardCommentRepository: InfoBoardCommentRepository,
  ) {}

  async create(
    createInfoBoardDto: CreateInfoBoardDto,
    userId: string,
  ): Promise<InfoBoard> {
    const newBoard = this.infoBoardRepository.create({
      ...createInfoBoardDto,
      user_id: userId,
    });
    return this.infoBoardRepository.save(newBoard);
  }

  async findAll(queryInfoBoardDto: QueryInfoBoardDto) {
    const page = parseInt(queryInfoBoardDto.page || '1', 10);
    const limit = parseInt(queryInfoBoardDto.limit || '10', 10);
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.infoBoardRepository.findAndCount({
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['user'],
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<InfoBoard> {
    const board = await this.infoBoardRepository.findOne({
      where: { info_board_id: id },
      relations: ['user', 'comments'],
    });
    if (!board) {
      throw new NotFoundException(`InfoBoard with ID ${id} not found`);
    }
    return board;
  }

  async update(
    id: number,
    updateInfoBoardDto: UpdateInfoBoardDto,
    userId: string,
  ): Promise<InfoBoard> {
    const board = await this.infoBoardRepository.findOneBy({ info_board_id: id });
    if (!board) {
      throw new NotFoundException(`InfoBoard with ID ${id} not found`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('You can only update your own boards.');
    }
    await this.infoBoardRepository.update(id, updateInfoBoardDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: string): Promise<void> {
    const board = await this.infoBoardRepository.findOneBy({ info_board_id: id });
    if (!board) {
      throw new NotFoundException(`InfoBoard with ID ${id} not found`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own boards.');
    }
    const result = await this.infoBoardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`InfoBoard with ID ${id} not found`);
    }
  }

  // --- Comment Methods ---

  async createComment(
    boardId: number,
    createCommentDto: CreateInfoBoardCommentDto,
    userId: string,
  ): Promise<InfoBoardComment> {
    const board = await this.infoBoardRepository.findOneBy({ info_board_id: boardId });
    if (!board) {
      throw new NotFoundException(`InfoBoard with ID ${boardId} not found`);
    }
    const newComment = this.infoBoardCommentRepository.create({
      ...createCommentDto,
      info_board_id: boardId,
      user_id: userId,
    });
    return this.infoBoardCommentRepository.save(newComment);
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateInfoBoardCommentDto,
    userId: string,
  ): Promise<InfoBoardComment | null> {
    const comment = await this.infoBoardCommentRepository.findOneBy({ comment_id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only update your own comments.');
    }
    await this.infoBoardCommentRepository.update(commentId, updateCommentDto);
    return this.infoBoardCommentRepository.findOneBy({ comment_id: commentId });
  }

  async removeComment(commentId: number, userId: string): Promise<void> {
    const comment = await this.infoBoardCommentRepository.findOneBy({ comment_id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own comments.');
    }
    const result = await this.infoBoardCommentRepository.delete(commentId);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
  }
}
