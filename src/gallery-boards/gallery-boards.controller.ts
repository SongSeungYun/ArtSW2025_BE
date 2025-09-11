import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GalleryBoardsService } from './gallery-boards.service';
import { CreateGalleryBoardDto } from './dto/create-gallery-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateGalleryBoardDto } from './dto/update-gallery-board.dto';
import { CreateGalleryBoardCommentDto } from './dto/create-gallery-board-comment.dto';
import { UpdateGalleryBoardCommentDto } from './dto/update-gallery-board-comment.dto';
import { QueryGalleryBoardDto } from './dto/query-gallery-board.dto';

@Controller('gallery-boards')
export class GalleryBoardsController {
  constructor(private readonly galleryBoardsService: GalleryBoardsService) {}

  // --- Board Methods ---
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10)) // Assuming max 10 images
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createGalleryBoardDto: CreateGalleryBoardDto,
    @Req() req,
  ) {
    return this.galleryBoardsService.create(
      createGalleryBoardDto,
      req.user.user_id,
      files,
    );
  }

  @Get()
  findAll(@Query() queryGalleryBoardDto: QueryGalleryBoardDto) {
    return this.galleryBoardsService.findAll(queryGalleryBoardDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.galleryBoardsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  // Note: File handling for updates will be needed here in the future.
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGalleryBoardDto: UpdateGalleryBoardDto,
    @Req() req,
  ) {
    return this.galleryBoardsService.update(id, updateGalleryBoardDto, req.user.user_id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.galleryBoardsService.remove(id, req.user.user_id);
  }

  // --- Comment Methods ---
  @Post(':boardId/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createCommentDto: CreateGalleryBoardCommentDto,
    @Req() req,
  ) {
    return this.galleryBoardsService.createComment(
      boardId,
      createCommentDto,
      req.user.user_id,
    );
  }

  @Put('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateGalleryBoardCommentDto,
    @Req() req,
  ) {
    return this.galleryBoardsService.updateComment(
      commentId,
      updateCommentDto,
      req.user.user_id,
    );
  }

  @Delete('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
  ) {
    return this.galleryBoardsService.removeComment(commentId, req.user.user_id);
  }
}
