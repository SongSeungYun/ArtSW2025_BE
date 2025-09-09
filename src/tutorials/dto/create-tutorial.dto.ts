import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BlankAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateTutorialDto {
  @IsNumber()
  @IsNotEmpty()
  method_id: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateIf(o => o.type === 'blank')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlankAnswerDto)
  @IsNotEmpty()
  blankAnswers: BlankAnswerDto[];
}
