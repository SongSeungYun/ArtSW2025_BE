import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateGalleryBoardDto {
  @IsString()
  @IsOptional()
  used_ai?: string;

  @IsString()
  @IsOptional()
  prompt?: string;
}
