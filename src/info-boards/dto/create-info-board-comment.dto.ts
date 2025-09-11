import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInfoBoardCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
