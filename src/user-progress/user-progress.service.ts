import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTutorialProgress } from './entities/user-tutorial-progress.entity';
import { User } from '../users/entities/user.entity';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { Method } from '../tutorials/entities/method.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserTutorialProgress)
    private readonly userTutorialProgressRepository: Repository<UserTutorialProgress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Method)
    private readonly methodRepository: Repository<Method>,
  ) {}

  async initializeProgress(user: User): Promise<void> {
    const methods = await this.methodRepository.find();

    const newProgresses = methods.map((method) =>
      this.userTutorialProgressRepository.create({
        user: user,
        method: method,
        is_tutorial_completed: false,
        is_multiple_choice_quiz_completed: false,
        is_short_answer_quiz_completed: false,
      }),
    );

    await this.userTutorialProgressRepository.save(newProgresses);
  }

  /*
  // NOTE: This method needs to be refactored based on the new entity structure.
  async getOverallProgress(userId: string) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const completedProgress = await this.userTutorialProgressRepository.find({
      where: { user_id: userId, is_tutorial_completed: true },
      relations: ['method'],
    });

    // This part is no longer valid
    // const quizProgress = await this.userQuizProgressRepository.findOne({
    //   where: { user_id: userId },
    // });

    return {
      user: { userId: user.user_id, email: user.email },
      completedMethods: completedProgress.map((p) => ({
        methodId: p.method_id,
        methodName: p.method ? p.method.method_name : null,
        completedAt: 'N/A',
      })),
      // quizOverallPassed: quizProgress ? quizProgress.passed : false,
      summary: {
        methodsCompletedCount: completedProgress.length,
        // quizChallengePassed: quizProgress ? quizProgress.passed : false,
      },
    };
  }
  */

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

  /*
  // NOTE: This method needs to be refactored based on the new entity structure.
  async updateMethodProgress(
    userId: string,
    methodId: number,
    updateDto: UpdateUserProgressDto,
  ) {
    let progress = await this.userTutorialProgressRepository.findOne({
      where: { user_id: userId, method_id: methodId },
    });

    if (!progress) {
      // Creating a new progress record might need more info based on the DTO
      progress = this.userTutorialProgressRepository.create({
        user_id: userId,
        method_id: methodId,
        // ... other fields need to be set
      });
    } else {
      // Update logic needs to be defined based on the DTO
      // e.g., progress.is_tutorial_completed = updateDto.is_tutorial_completed
    }

    return this.userTutorialProgressRepository.save(progress);
  }
  */
}
