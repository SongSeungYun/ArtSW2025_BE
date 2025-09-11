import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInfoBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;
}
