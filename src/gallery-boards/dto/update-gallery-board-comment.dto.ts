import { IsOptional, IsString } from 'class-validator';

export class UpdateGalleryBoardCommentDto {
  @IsOptional()
  @IsString()
  content?: string;
}
