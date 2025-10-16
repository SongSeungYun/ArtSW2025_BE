import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { Option } from './entities/option.entity';
import { UserProgressModule } from '../user-progress/user-progress.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Option]), UserProgressModule, AiModule],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}