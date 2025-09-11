import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GalleryBoardRepository } from './repositories/gallery-board.repository';
import { CreateGalleryBoardDto } from './dto/create-gallery-board.dto';
import { GalleryBoard } from './entities/gallery-board.entity';
import { UpdateGalleryBoardDto } from './dto/update-gallery-board.dto';
import { GalleryBoardCommentRepository } from './repositories/gallery-board-comment.repository';
import { CreateGalleryBoardCommentDto } from './dto/create-gallery-board-comment.dto';
import { UpdateGalleryBoardCommentDto } from './dto/update-gallery-board-comment.dto';
import { GalleryBoardComment } from './entities/gallery-board-comment.entity';
import { UploadService } from '../upload/upload.service';
import { GalleryBoardImage } from './entities/gallery-board-image.entity';
import { QueryGalleryBoardDto } from './dto/query-gallery-board.dto';

@Injectable()
export class GalleryBoardsService {
  constructor(
    private readonly galleryBoardRepository: GalleryBoardRepository,
    private readonly galleryBoardCommentRepository: GalleryBoardCommentRepository,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createGalleryBoardDto: CreateGalleryBoardDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ): Promise<GalleryBoard> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const boardData = { ...createGalleryBoardDto, user_id: userId };
      const board = await queryRunner.manager.save(GalleryBoard, boardData);

      if (files && files.length > 0) {
        const imageUrls = await this.uploadService.uploadFiles(files);
        const imageEntities = imageUrls.map((url, index) => {
          return queryRunner.manager.create(GalleryBoardImage, {
            gallery_board_id: board.gallery_board_id,
            image_url: url,
            sort_order: index + 1,
          });
        });
        await queryRunner.manager.save(imageEntities);
      }

      await queryRunner.commitTransaction();

      // Return the full board with relations
      return this.findOne(board.gallery_board_id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('--- Transaction Error in create gallery board ---', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryGalleryBoardDto: QueryGalleryBoardDto) {
    const page = parseInt(queryGalleryBoardDto.page || '1', 10);
    const limit = parseInt(queryGalleryBoardDto.limit || '10', 10);
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.galleryBoardRepository.findAndCount({
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['user', 'images'],
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

  async findOne(id: number): Promise<GalleryBoard> {
    const board = await this.galleryBoardRepository.findOne({
      where: { gallery_board_id: id },
      relations: ['user', 'images', 'comments'],
    });
    if (!board) {
      throw new NotFoundException(`GalleryBoard with ID ${id} not found`);
    }
    return board;
  }

  async update(
    id: number,
    updateGalleryBoardDto: UpdateGalleryBoardDto,
    userId: string,
  ): Promise<GalleryBoard> {
    const board = await this.galleryBoardRepository.findOneBy({ gallery_board_id: id });
    if (!board) {
      throw new NotFoundException(`GalleryBoard with ID ${id} not found`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('You can only update your own boards.');
    }
    // Note: Image handling logic will be needed here in the future.
    await this.galleryBoardRepository.update(id, updateGalleryBoardDto);
    return this.findOne(id);
  }

  async remove(
    id: number,
    userId: string,
  ): Promise<void> {
    // First, fetch the board with its images to get the URLs
    const board = await this.galleryBoardRepository.findOne({
      where: { gallery_board_id: id },
      relations: ['images'],
    });

    if (!board) {
      throw new NotFoundException(`GalleryBoard with ID ${id} not found`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own boards.');
    }

    // If there are images, delete them from S3
    if (board.images && board.images.length > 0) {
      const imageUrls = board.images.map(image => image.image_url);
      await this.uploadService.deleteFiles(imageUrls);
    }

    // After S3 deletion (or if there were no images), delete the board from the DB.
    // The database cascade will handle deleting the image and comment records.
    const result = await this.galleryBoardRepository.delete(id);

    if (result.affected === 0) {
      // This case might be rare if the initial findOne succeeds, but it's good practice.
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }

  // --- Comment Methods ---

  async createComment(
    boardId: number,
    createCommentDto: CreateGalleryBoardCommentDto,
    userId: string,
  ): Promise<GalleryBoardComment> {
    const board = await this.galleryBoardRepository.findOneBy({ gallery_board_id: boardId });
    if (!board) {
      throw new NotFoundException(`GalleryBoard with ID ${boardId} not found`);
    }
    const newComment = this.galleryBoardCommentRepository.create({
      ...createCommentDto,
      gallery_board_id: boardId,
      user_id: userId,
    });
    return this.galleryBoardCommentRepository.save(newComment);
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateGalleryBoardCommentDto,
    userId: string,
  ): Promise<GalleryBoardComment | null> {
    const comment = await this.galleryBoardCommentRepository.findOneBy({ comment_id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only update your own comments.');
    }
    await this.galleryBoardCommentRepository.update(commentId, updateCommentDto);
    return this.galleryBoardCommentRepository.findOneBy({ comment_id: commentId });
  }

  async removeComment(
    commentId: number,
    userId: string,
  ): Promise<void> {
    const comment = await this.galleryBoardCommentRepository.findOneBy({ comment_id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own comments.');
    }
    const result = await this.galleryBoardCommentRepository.delete(commentId);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
  }
}

