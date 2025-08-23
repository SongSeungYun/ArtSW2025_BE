// Path: src/user-progress/user-progress.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTutorialProgress } from './entities/user-tutorial-progress.entity';
import { UserQuizProgress } from './entities/user-quiz-progress.entity';
import { User } from '../users/entities/user.entity';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { TutorialStatus } from '../common/enums/tutorial-status.enum';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserTutorialProgress)
    private readonly userTutorialProgressRepository: Repository<UserTutorialProgress>,
    @InjectRepository(UserQuizProgress)
    private readonly userQuizProgressRepository: Repository<UserQuizProgress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOverallProgress(userId: number) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const completedProgress = await this.userTutorialProgressRepository.find({
      where: { user_id: userId, tutorial_status: TutorialStatus.COMPLETED },
      relations: ['method'],
    });

    const quizProgress = await this.userQuizProgressRepository.findOne({
      where: { user_id: userId },
    });

    return {
      user: { userId: user.user_id, email: user.email },
      completedMethods: completedProgress.map(p => ({
        methodId: p.method_id,
        methodName: p.method ? p.method.method_name : null,
        completedAt: 'N/A',
      })),
      quizOverallPassed: quizProgress ? quizProgress.passed : false,
      summary: {
        methodsCompletedCount: completedProgress.length,
        quizChallengePassed: quizProgress ? quizProgress.passed : false,
      },
    };
  }

  async getMethodProgress(userId: number, methodId: number) {
    const progress = await this.userTutorialProgressRepository.findOne({
      where: { user_id: userId, method_id: methodId },
    });

    if (!progress) {
      throw new NotFoundException(
        `Progress for user ${userId} on method ${methodId} not found`,
      );
    }
    return progress;
  }

  async updateMethodProgress(
    userId: number,
    methodId: number,
    updateDto: UpdateUserProgressDto,
  ) {
    let progress = await this.userTutorialProgressRepository.findOne({
      where: { user_id: userId, method_id: methodId },
    });

    if (!progress) {
      progress = this.userTutorialProgressRepository.create({
        user_id: userId,
        method_id: methodId,
        tutorial_status: updateDto.status,
      });
    } else {
      progress.tutorial_status = updateDto.status;
    }

    return this.userTutorialProgressRepository.save(progress);
  }
}

