import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Option } from './entities/option.entity';
import { CreateQuizSubmissionDto } from './dto/quiz-submission.dto';
import { UserQuizProgress } from '../user-progress/entities/user-quiz-progress.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(UserQuizProgress)
    private readonly userQuizProgressRepository: Repository<UserQuizProgress>,
  ) {}

  async findRandomQuizzes(mcCount: number) {
    // Fetch random multiple-choice quizzes
    const mcQuizzes = await this.quizRepository.find({
      where: { type: 'multiple-choice' },
      relations: ['options'],
      order: { quiz_id: 'ASC' }, // Placeholder for random order, actual random might need more complex query
      take: mcCount,
    });

    // Fetch 1 random short-answer quiz
    const saQuiz = await this.quizRepository.findOne({
      where: { type: 'short-answer' },
      order: { quiz_id: 'ASC' }, // Placeholder for random order
    });

    const quizzes = [...mcQuizzes];
    if (saQuiz) {
      quizzes.push(saQuiz);
    }

    // Remove is_answer from options before sending to client
    return quizzes.map(quiz => {
      if (quiz.options) {
        const sanitizedOptions = quiz.options.map(({ is_answer, ...rest }) => rest);
        return { ...quiz, options: sanitizedOptions };
      }
      return quiz;
    });
  }

  async gradeSubmissions(userId: number, submissionDto: CreateQuizSubmissionDto) {
    const results: any[] = [];
    let correctCount = 0;
    let totalGraded = 0;

    for (const submission of submissionDto.submissions) {
      const quiz = await this.quizRepository.findOne({
        where: { quiz_id: submission.quizId },
        relations: ['options'],
      });

      if (!quiz) {
        results.push({ quizId: submission.quizId, error: 'Quiz not found' });
        continue;
      }

      let passedIndividual = false;
      let correctAnswer: number | string | null = null;

      if (quiz.type === 'multiple-choice') {
        const correctOption = quiz.options.find(opt => opt.is_answer);
        if (correctOption) {
          correctAnswer = correctOption.option_id;
          if (submission.selectedOptionId === correctOption.option_id) {
            passedIndividual = true;
            correctCount++;
          }
        }
        totalGraded++;
      } else if (quiz.type === 'short-answer') {
        passedIndividual = false; // Assume false for now, or null for pending
        correctAnswer = 'Manual Review'; // Indicate manual review needed
        totalGraded++;
      }

      results.push({
        quizId: submission.quizId,
        passed: passedIndividual,
        correctAnswer: correctAnswer,
        submittedAnswer: submission.selectedOptionId || submission.answerText,
      });
    }

    const overallPassed = totalGraded > 0 && correctCount === totalGraded;

    let userProgress = await this.userQuizProgressRepository.findOne({
      where: { user_id: userId },
    });

    if (userProgress) {
      userProgress.passed = overallPassed;
    } else {
      userProgress = this.userQuizProgressRepository.create({
        user_id: userId,
        passed: overallPassed,
      });
    }
    await this.userQuizProgressRepository.save(userProgress);

    return { results, overallPassed };
  }
}
