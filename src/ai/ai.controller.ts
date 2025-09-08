import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { EvaluatePromptDto } from './dto/evaluate-prompt.dto';

@Controller('evaluations')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async createEvaluation(@Body() evaluatePromptDto: EvaluatePromptDto) {
    return this.aiService.createEvaluation(evaluatePromptDto);
  }
}
