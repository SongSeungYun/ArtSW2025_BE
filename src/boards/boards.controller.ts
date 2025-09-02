import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryBoardDto } from './dto/query-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  createBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(new ValidationPipe({ whitelist: true }))
    createBoardDto: CreateBoardDto,
    @Req() req,
  ) {
    console.log('--- Create Board API ---');
    console.log('Received Files:', files);
    console.log('Received DTO:', createBoardDto);
    console.log('------------------------');

    return this.boardsService.createBoard(createBoardDto, req.user.user_id, files);
  }

  @Get()
  getBoards(@Query() queryBoardDto: QueryBoardDto) {
    return this.boardsService.getBoards(queryBoardDto);
  }

  @Get(':board_id')
  getBoardById(@Param('board_id', ParseIntPipe) boardId: number) {
    return this.boardsService.getBoardById(boardId);
  }

  @Put(':board_id')
  updateBoard(
    @Param('board_id', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req,
  ) {
    return this.boardsService.updateBoard(boardId, updateBoardDto, req.user.user_id);
  }

  @Delete(':board_id')
  deleteBoard(@Param('board_id', ParseIntPipe) boardId: number, @Req() req) {
    return this.boardsService.deleteBoard(boardId, req.user.user_id);
  }

  @Post(':board_id/comments')
  createComment(
    @Param('board_id', ParseIntPipe) boardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.boardsService.createComment(boardId, createCommentDto, req.user.user_id);
  }

  @Put(':board_id/comments/:comment_id')
  updateComment(
    @Param('comment_id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.boardsService.updateComment(commentId, updateCommentDto, req.user.user_id);
  }

  @Delete(':board_id/comments/:comment_id')
  deleteComment(@Param('comment_id', ParseIntPipe) commentId: number, @Req() req) {
    return this.boardsService.deleteComment(commentId, req.user.user_id);
  }
}
