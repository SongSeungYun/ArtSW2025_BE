import { IsInt, IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SubmissionDto {
  @IsInt()
  quizId: number;

  @IsString()
  @IsEnum(['multiple-choice', 'short-answer'])
  type: 'multiple-choice' | 'short-answer';

  @IsInt()
  @IsOptional()
  selectedOptionId?: number;

  @IsString()
  @IsOptional()
  answerText?: string;
}

export class CreateQuizSubmissionDto {
  @IsNotEmpty()
  @IsNumber()
  methodId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionDto)
  submissions: SubmissionDto[];
}

