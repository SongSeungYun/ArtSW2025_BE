import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { UserTutorialProgress } from '../user-progress/entities/user-tutorial-progress.entity';
import { TutorialStatus } from '../common/enums/tutorial-status.enum';
import { Method } from './entities/method.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { BlankAnswerRepository } from './repositories/blank-answer.repository';
import { BlankAnswer } from './entities/blank-answer.entity';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,
    @InjectRepository(UserTutorialProgress)
    private readonly userProgressRepository: Repository<UserTutorialProgress>,
    @InjectRepository(Method)
    private readonly methodRepository: Repository<Method>,
    private readonly blankAnswerRepository: BlankAnswerRepository,
  ) {}

  async create(createTutorialDto: CreateTutorialDto): Promise<Tutorial> {
    const { blankAnswers, method_id, ...tutorialData } = createTutorialDto;

    const newTutorial = this.tutorialRepository.create({
      ...tutorialData,
      method: { method_id },
    });

    const savedTutorial = await this.tutorialRepository.save(newTutorial);

    if (savedTutorial.type === 'blank' && blankAnswers && blankAnswers.length > 0) {
      const answersToSave = blankAnswers.map(answerDto => {
        const newAnswer = new BlankAnswer();
        newAnswer.order = answerDto.order;
        newAnswer.answer = answerDto.answer;
        newAnswer.tutorial = savedTutorial;
        return newAnswer;
      });
      await this.blankAnswerRepository.save(answersToSave);
    }

    return this.findOne(savedTutorial.tutorial_id);
  }

  async findAll() {
    return this.tutorialRepository.find({
      relations: ['method', 'blankAnswers'],
    });
  }

  async findOne(tutorialId: number) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { tutorial_id: tutorialId },
      relations: ['method', 'blankAnswers'],
    });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${tutorialId} not found`);
    }
    return tutorial;
  }

  async completeMethod(userId: string, methodId: number) {
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
