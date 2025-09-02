import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardImage } from './entities/board-image.entity';
import { BoardComment } from './entities/board-comment.entity';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import { BoardCommentRepository } from './repositories/board-comment.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardImage, BoardComment]),
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardRepository,
    BoardImageRepository,
    BoardCommentRepository,
    UploadService,
  ],
})
export class BoardsModule {}
