import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateGalleryBoardDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  used_ai?: string[];

  @IsString()
  @IsOptional()
  prompt?: string;
}
