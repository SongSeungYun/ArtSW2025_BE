import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryBoard } from './entities/gallery-board.entity';
import { GalleryBoardImage } from './entities/gallery-board-image.entity';
import { GalleryBoardComment } from './entities/gallery-board-comment.entity';
import { GalleryBoardRepository } from './repositories/gallery-board.repository';
import { GalleryBoardImageRepository } from './repositories/gallery-board-image.repository';
import { GalleryBoardCommentRepository } from './repositories/gallery-board-comment.repository';
import { GalleryBoardsService } from './gallery-boards.service';
import { GalleryBoardsController } from './gallery-boards.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GalleryBoard,
      GalleryBoardImage,
      GalleryBoardComment,
    ]),
    UploadModule,
  ],
  controllers: [GalleryBoardsController],
  providers: [
    GalleryBoardsService,
    GalleryBoardRepository,
    GalleryBoardImageRepository,
    GalleryBoardCommentRepository,
  ],
})
export class GalleryBoardsModule {}
