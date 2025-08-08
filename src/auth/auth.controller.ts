import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    // 비밀번호 등 민감 정보는 제외하고 반환
    const { userId, name, email, createdAt } = user;
    return { userId, name, email, createdAt };
  }

  @UseGuards(LocalAuthGuard) // LocalStrategy 실행
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // req.user는 LocalStrategy의 validate() 반환값인 User 객체
    return this.authService.login(req.user as User);
  }

  // JWT 인증이 필요한 테스트용 프로필 조회 API
  @UseGuards(JwtAuthGuard) // JwtStrategy 실행
  @Get('profile')
  getProfile(@Request() req) {
    // req.user는 JwtStrategy의 validate() 반환값
    return req.user;
  }
}