import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGalleryBoardCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
