import { IsString, IsNotEmpty } from 'class-validator';

export class EvaluatePromptDto {
  @IsString()
  @IsNotEmpty()
  problem_id: string;

  @IsString()
  @IsNotEmpty()
  user_prompt: string;
}
