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

  async getOverallProgress(userId: string) {
    // 1. Fetch all progress records for the user, including method details
    const userProgressRecords = await this.userTutorialProgressRepository.find({
      where: { user_id: userId },
      relations: ['method'],
      order: {
        method_id: 'ASC',
      },
    });

    if (!userProgressRecords || userProgressRecords.length === 0) {
      // This case might happen if a user was created before the progress initialization logic was added
      throw new NotFoundException(`Progress for user with ID ${userId} not found.`);
    }

    // 2. Map to the desired response structure
    const progress_by_method = userProgressRecords.map((p) => ({
      method_id: p.method_id,
      method_name: p.method.method_name,
      is_tutorial_completed: p.is_tutorial_completed,
      is_multiple_choice_quiz_completed: p.is_multiple_choice_quiz_completed,
      is_short_answer_quiz_completed: p.is_short_answer_quiz_completed,
    }));

    // 3. Calculate the summary
    const summary = userProgressRecords.reduce(
      (acc, p) => {
        if (p.is_tutorial_completed) acc.completed_tutorials++;
        if (p.is_multiple_choice_quiz_completed) acc.completed_mc_quizzes++;
        if (p.is_short_answer_quiz_completed) acc.completed_sa_quizzes++;
        return acc;
      },
      {
        total_methods: userProgressRecords.length,
        completed_tutorials: 0,
        completed_mc_quizzes: 0,
        completed_sa_quizzes: 0,
      },
    );

    // 4. Return the final object
    return {
      user_id: userId,
      progress_by_method,
      summary,
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
