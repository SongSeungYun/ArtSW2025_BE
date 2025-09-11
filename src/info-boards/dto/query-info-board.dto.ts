import { IsOptional, IsString } from 'class-validator';

export class QueryInfoBoardDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
