import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTutorialProgress } from './entities/user-tutorial-progress.entity';
import { UserQuizProgress } from './entities/user-quiz-progress.entity';
import { User } from '../users/entities/user.entity';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { TutorialStatus } from '../common/enums/tutorial-status.enum';
import { Method } from '../tutorials/entities/method.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserTutorialProgress)
    private readonly userTutorialProgressRepository: Repository<UserTutorialProgress>,
    @InjectRepository(UserQuizProgress)
    private readonly userQuizProgressRepository: Repository<UserQuizProgress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Method)
    private readonly methodRepository: Repository<Method>,
  ) {}

  async initializeProgress(user: User): Promise<void> {
    // 1. Initialize Tutorial Progress
    const methods = await this.methodRepository.find();
    const tutorialProgresses = methods.map((method) =>
      this.userTutorialProgressRepository.create({
        user: user,
        method: method,
        tutorial_status: TutorialStatus.UNCOMPLETED,
      }),
    );
    await this.userTutorialProgressRepository.save(tutorialProgresses);

    // 2. Initialize Quiz Progress
    const quizTypes = ['multiple-choice', 'short-answer'];
    const quizProgresses = quizTypes.map((quizType) =>
      this.userQuizProgressRepository.create({
        user: user,
        type: quizType,
        passed: false,
      }),
    );
    await this.userQuizProgressRepository.save(quizProgresses);
  }

  async getOverallProgress(userId: string) {
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
      completedMethods: completedProgress.map((p) => ({
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

  async getMethodProgress(userId: string, methodId: number) {
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
    userId: string,
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