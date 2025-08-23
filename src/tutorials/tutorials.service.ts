import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { UserTutorialProgress } from '../user-progress/entities/user-tutorial-progress.entity';
import { TutorialStatus } from '../common/enums/tutorial-status.enum';
import { Method } from './entities/method.entity';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,
    @InjectRepository(UserTutorialProgress)
    private readonly userProgressRepository: Repository<UserTutorialProgress>,
    @InjectRepository(Method)
    private readonly methodRepository: Repository<Method>,
  ) {}

  async findAll() {
    return this.tutorialRepository.find({
      relations: ['method'],
    });
  }

  async findOne(tutorialId: number) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { tutorial_id: tutorialId },
      relations: ['method'],
    });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${tutorialId} not found`);
    }
    return tutorial;
  }

  async completeMethod(userId: number, methodId: number) {
    // Check if the method exists
    const method = await this.methodRepository.findOneBy({ method_id: methodId });
    if (!method) {
      throw new NotFoundException(`Method with ID ${methodId} not found`);
    }

    let progress = await this.userProgressRepository.findOne({
      where: { user_id: userId, method_id: methodId },
    });

    if (progress) {
      progress.tutorial_status = TutorialStatus.COMPLETED;
    } else {
      progress = this.userProgressRepository.create({
        user_id: userId,
        method_id: methodId,
        tutorial_status: TutorialStatus.COMPLETED,
      });
    }

    return this.userProgressRepository.save(progress);
  }
}
