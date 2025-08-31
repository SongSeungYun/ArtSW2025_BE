import { IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { BoardType } from '../entities/board.entity';

export class QueryBoardDto {
  @IsEnum(BoardType)
  @IsOptional()
  board_type?: BoardType;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
