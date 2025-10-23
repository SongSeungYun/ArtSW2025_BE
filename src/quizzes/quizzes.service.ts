import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizSubmissionDto } from './dto/quiz-submission.dto';
import { UserProgressService } from '../user-progress/user-progress.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly userProgressService: UserProgressService,
    private readonly aiService: AiService,
  ) {}

  async gradeSubmissions(
    userId: string,
    submissionDto: CreateQuizSubmissionDto,
  ) {
    const { methodId, submissions } = submissionDto;

    if (!submissions || submissions.length === 0) {
      throw new BadRequestException('Submissions array cannot be empty.');
    }

    const quizType = submissions[0].type;

    if (quizType === 'multiple-choice') {
      return this.gradeMultipleChoice(userId, methodId, submissions);
    } else if (quizType === 'short-answer') {
      return this.gradeShortAnswer(userId, methodId, submissions);
    } else {
      throw new BadRequestException('Invalid or mixed quiz types in submission.');
    }
  }

  private async gradeMultipleChoice(
    userId: string,
    methodId: number,
    submissions: any[],
  ) {
    const results: any[] = [];
    let correctCount = 0;

    for (const submission of submissions) {
      const quiz = await this.quizRepository.findOne({
        where: { quiz_id: submission.quizId, type: 'multiple-choice' },
        relations: ['options'],
      });

      if (!quiz) {
        results.push({ quizId: submission.quizId, error: 'Quiz not found' });
        continue;
      }

      const correctOption = quiz.options.find((opt) => opt.is_answer);
      let passedIndividual = false;

      if (correctOption && submission.selectedOptionId === correctOption.option_id) {
        passedIndividual = true;
        correctCount++;
      }

      results.push({
        quizId: submission.quizId,
        passed: passedIndividual,
        correctAnswerId: correctOption ? correctOption.option_id : null,
      });
    }

    const allPassed = correctCount === submissions.length;
    if (allPassed) {
      await this.userProgressService.updateQuizCompletion(
        userId,
        methodId,
        'multiple-choice',
        true,
      );
    }

    return {
      quizType: 'multiple-choice',
      results,
      overallPassed: allPassed,
    };
  }

  private async gradeShortAnswer(
    userId: string,
    methodId: number,
    submissions: any[],
  ) {
    if (submissions.length > 1) {
      throw new BadRequestException(
        'Only one short-answer submission is allowed at a time.',
      );
    }
    const submission = submissions[0];
    const { quizId, answerText } = submission;

    const aiResponse = await this.aiService.createEvaluation({
      problem_id: quizId.toString(),
      user_prompt: answerText,
    });

    const score = aiResponse.overall_score || 0;
    const feedback = aiResponse.llm_eval?.feedback || 'No feedback received.';

    const passed = score >= 80; // Passing threshold

    if (passed) {
      await this.userProgressService.updateQuizCompletion(
        userId,
        methodId,
        'short-answer',
        true,
      );
    }

    return {
      quizType: 'short-answer',
      quizId,
      passed,
      score,
      feedback,
    };
  }

  async findQuizzesByMethod(methodId: number) {
    const quizzes = await this.quizRepository.find({
      where: { method_id: methodId, type: 'multiple-choice' },
      relations: ['options'],
      take: 3,
    });

    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(`No multiple-choice quizzes found for method ID ${methodId}`);
    }

    return quizzes.map((quiz) => {
      // Sanitize options to remove the is_answer field before sending to the client
      if (quiz.options) {
        const sanitizedOptions = quiz.options.map(({ is_answer, ...rest }) => rest);
        return { ...quiz, options: sanitizedOptions };
      }
      return quiz;
    });
  }

  async findRandomQuizzes(mcCount: number) {
    const mcQuizzes = await this.quizRepository.find({
      where: { type: 'multiple-choice' },
      relations: ['options'],
      order: { quiz_id: 'ASC' },
      take: mcCount,
    });

    const saQuiz = await this.quizRepository.findOne({
      where: { type: 'short-answer' },
      order: { quiz_id: 'ASC' },
    });

    const quizzes = [...mcQuizzes];
    if (saQuiz) {
      quizzes.push(saQuiz);
    }

    return quizzes.map((quiz) => {
      if (quiz.options) {
        const sanitizedOptions = quiz.options.map(({ is_answer, ...rest }) => rest);
        return { ...quiz, options: sanitizedOptions };
      }
      return quiz;
    });
  }
}
