import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoBoard } from './entities/info-board.entity';
import { InfoBoardComment } from './entities/info-board-comment.entity';
import { MonthlyPrompt } from './entities/monthly-prompt.entity'; // Added import
import { InfoBoardRepository } from './repositories/info-board.repository';
import { InfoBoardCommentRepository } from './repositories/info-board-comment.repository';
import { InfoBoardsService } from './info-boards.service';
import { InfoBoardsController } from './info-boards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InfoBoard, InfoBoardComment, MonthlyPrompt])], // Added MonthlyPrompt
  controllers: [InfoBoardsController],
  providers: [
    InfoBoardsService,
    InfoBoardRepository,
    InfoBoardCommentRepository,
  ],
})
export class InfoBoardsModule {}
