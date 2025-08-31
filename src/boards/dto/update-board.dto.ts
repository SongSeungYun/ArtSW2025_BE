import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateImageDto {
  @IsNumber()
  @IsOptional()
  image_id?: number;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsOptional()
  sort_order?: number;
}

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateImageDto)
  @IsOptional()
  images?: UpdateImageDto[];
}
