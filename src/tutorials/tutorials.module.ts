import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialsController } from './tutorials.controller';
import { TutorialsService } from './tutorials.service';
import { Tutorial } from './entities/tutorial.entity';
import { Method } from './entities/method.entity';
import { UserTutorialProgress } from '../user-progress/entities/user-tutorial-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial, Method, UserTutorialProgress])],
  controllers: [TutorialsController],
  providers: [TutorialsService],
})
export class TutorialsModule {}