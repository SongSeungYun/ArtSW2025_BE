import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
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
    const { user_id, name, email, createdAt } = user;
    return { userId: user_id, name, email, createdAt };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshTokens(@Request() req) {
    return this.authService.refreshAccessToken(req.user as User);
  }

  // --- Google Social Login ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const { access_token, refresh_token } = await this.authService.socialLogin(req.user as User);

      const user = req.user as User;
      const userInfo = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectURL =
        `${frontendURL}/auth/callback?` +
        `access_token=${encodeURIComponent(access_token)}&` +
        `refresh_token=${encodeURIComponent(refresh_token)}&` +
        `user=${encodeURIComponent(JSON.stringify(userInfo))}`;

      return res.redirect(redirectURL);
    } catch (error) {
      console.error('Google 로그인 콜백 오류:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendURL}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // --- Kakao Social Login ---
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const { access_token, refresh_token } = await this.authService.socialLogin(req.user as User);

      const user = req.user as User;
      const userInfo = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectURL =
        `${frontendURL}/auth/callback?` +
        `access_token=${encodeURIComponent(access_token)}&` +
        `refresh_token=${encodeURIComponent(refresh_token)}&` +
        `user=${encodeURIComponent(JSON.stringify(userInfo))}`;

      return res.redirect(redirectURL);
    } catch (error) {
      console.error('Kakao 로그인 콜백 오류:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendURL}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}