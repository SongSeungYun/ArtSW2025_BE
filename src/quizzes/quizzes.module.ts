import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { Option } from './entities/option.entity';
import { UserQuizProgress } from '../user-progress/entities/user-quiz-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Option, UserQuizProgress])],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}