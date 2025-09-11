import { IsOptional, IsString } from 'class-validator';

export class QueryGalleryBoardDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
