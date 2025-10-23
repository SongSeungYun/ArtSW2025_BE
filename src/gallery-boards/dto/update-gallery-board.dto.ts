import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateGalleryBoardDto {
  @IsOptional()
  @IsString()
  used_ai?: string;

  @IsOptional()
  @IsString()
  prompt?: string;
}
