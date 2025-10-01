import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgressController } from './user-progress.controller';
import { UserProgressService } from './user-progress.service';
import { UserTutorialProgress } from './entities/user-tutorial-progress.entity';
import { UserQuizProgress } from './entities/user-quiz-progress.entity';
import { User } from '../users/entities/user.entity';
import { Method } from '../tutorials/entities/method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTutorialProgress,
      UserQuizProgress,
      User,
      Method,
    ]),
  ],
  controllers: [UserProgressController],
  providers: [UserProgressService],
  exports: [UserProgressService],
})
export class UserProgressModule {}