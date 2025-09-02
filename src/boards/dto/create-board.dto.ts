import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BoardType } from '../entities/board.entity';

export class CreateBoardDto {
  @IsEnum(BoardType)
  @IsNotEmpty()
  board_type: BoardType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
