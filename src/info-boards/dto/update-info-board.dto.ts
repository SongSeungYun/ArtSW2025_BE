import { IsOptional, IsString } from 'class-validator';

export class UpdateInfoBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
