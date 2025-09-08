import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EvaluatePromptDto } from './dto/evaluate-prompt.dto';

@Injectable()
export class AiService {
  constructor(private readonly httpService: HttpService) {}

  async createEvaluation(evaluatePromptDto: EvaluatePromptDto) {
    const externalApiUrl = 'http://localhost:8000/api/run_and_evaluate';

    try {
      // 1. 외부 API 호출
      const response = await firstValueFrom(
        this.httpService.post(externalApiUrl, {
          problem_id: evaluatePromptDto.problem_id,
          user_prompt: evaluatePromptDto.user_prompt,
          mode: 'evaluation',
        }),
      );

      const data = response.data;

      // 2. 데이터 추출 및 재구성
      const llmEval = data.llm_eval || { quality: {}, feedback: 'N/A', overall_score: 'N/A' };
      const heuristic = data.heuristic || { expected_skills: [], flags: {}, score: 0, ratio: 0 };

      const extractedData = {
        user_output: data.user_output,
        reference_output: data.reference_output,
        llm_eval: {
          quality: llmEval.quality,
          feedback: llmEval.feedback,
        },
        heuristic: {
          expected_skills: heuristic.expected_skills,
          flags: heuristic.flags,
          score: heuristic.score,
          ratio: parseFloat(heuristic.ratio.toFixed(2)),
        },
        overall_score: llmEval.overall_score,
      };

      // 3. 재구성한 데이터 반환
      return extractedData;

    } catch (error) {
      console.error('Error calling external API:', error.response?.data || error.message);
      throw new Error('Failed to get evaluation from external API.');
    }
  }
}
