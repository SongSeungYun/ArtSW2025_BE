import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { CheckVerificationDto } from './dto/check-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerificationEmail(@Body() body: EmailVerificationDto) {
    await this.authService.sendVerificationEmail(body.email);
    return { message: 'Verification email sent.' };
  }

  @Post('email/check-verification')
  @HttpCode(HttpStatus.OK)
  async checkVerificationCode(@Body() body: CheckVerificationDto) {
    await this.authService.checkVerificationCode(body.email, body.code);
    return { message: 'Email verified successfully.' };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    const { userId, name, email, createdAt } = user;
    return { userId, name, email, createdAt };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user as User);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}