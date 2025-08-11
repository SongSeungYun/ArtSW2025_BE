import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
