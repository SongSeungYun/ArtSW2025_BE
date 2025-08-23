import { Controller, Get, Post, Query, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizSubmissionDto } from './dto/quiz-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming JWT guard path

@ApiTags('Quizzes')
@Controller('quiz')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('random')
  @ApiOperation({ summary: 'Get random multiple-choice and short-answer quizzes' })
  @ApiResponse({ status: 200, description: 'Returns a list of random quizzes.' })
  async getRandomQuizzes(@Query('mcCount', ParseIntPipe) mcCount: number) {
    return this.quizzesService.findRandomQuizzes(mcCount);
  }

  @Post('submissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit quiz answers and get results' })
  @ApiResponse({ status: 200, description: 'Returns the results of the submitted quizzes.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async submitQuizzes(@Body() submissionDto: CreateQuizSubmissionDto, @Req() req) {
    const userId = req.user.user_id; // Assuming userId is in the JWT payload
    return this.quizzesService.gradeSubmissions(userId, submissionDto);
  }
}
