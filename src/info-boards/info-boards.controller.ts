import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InfoBoardsService } from './info-boards.service';
import { CreateInfoBoardDto } from './dto/create-info-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateInfoBoardDto } from './dto/update-info-board.dto';
import { CreateInfoBoardCommentDto } from './dto/create-info-board-comment.dto';
import { UpdateInfoBoardCommentDto } from './dto/update-info-board-comment.dto';
import { QueryInfoBoardDto } from './dto/query-info-board.dto';

@Controller('info-boards')
export class InfoBoardsController {
  constructor(private readonly infoBoardsService: InfoBoardsService) {}

  // --- Board Methods ---
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createInfoBoardDto: CreateInfoBoardDto, @Req() req) {
    return this.infoBoardsService.create(createInfoBoardDto, req.user.user_id);
  }

  @Get()
  findAll(@Query() queryInfoBoardDto: QueryInfoBoardDto) {
    return this.infoBoardsService.findAll(queryInfoBoardDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.infoBoardsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInfoBoardDto: UpdateInfoBoardDto,
    @Req() req,
  ) {
    return this.infoBoardsService.update(id, updateInfoBoardDto, req.user.user_id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.infoBoardsService.remove(id, req.user.user_id);
  }

  // --- Comment Methods ---
  @Post(':boardId/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createCommentDto: CreateInfoBoardCommentDto,
    @Req() req,
  ) {
    return this.infoBoardsService.createComment(
      boardId,
      createCommentDto,
      req.user.user_id,
    );
  }

  @Put('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateInfoBoardCommentDto,
    @Req() req,
  ) {
    return this.infoBoardsService.updateComment(
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
    return this.infoBoardsService.removeComment(commentId, req.user.user_id);
  }
}
