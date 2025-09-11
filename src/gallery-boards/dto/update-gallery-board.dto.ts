import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateGalleryBoardDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  used_ai?: string[];

  @IsOptional()
  @IsString()
  prompt?: string;
}
