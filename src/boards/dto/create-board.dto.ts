import { IsString, IsNotEmpty, IsEnum, IsArray, ValidateNested, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BoardType } from '../entities/board.entity';

class ImageDto {
  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  @IsNumber()
  @IsNotEmpty()
  sort_order: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}
