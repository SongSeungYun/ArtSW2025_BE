import { IsOptional, IsString } from 'class-validator';

export class UpdateInfoBoardCommentDto {
  @IsOptional()
  @IsString()
  content?: string;
}
