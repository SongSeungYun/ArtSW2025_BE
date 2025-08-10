import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입 로직
  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // 사용자 검증 로직 (LocalStrategy에서 사용)
  async validateUser(loginId: string, pass: string): Promise<User> {
    // 1. 아이디로 사용자 조회 (없으면 UsersService에서 404 에러 발생)
    const localAuth = await this.usersService.findLocalAuthByLoginId(loginId);

    // --- 임시 디버깅 코드 시작 ---
    console.log('--- Password Comparison ---');
    console.log('Input Password:', pass);
    console.log('DB Hashed Password:', localAuth.passwordHash);
    // --- 임시 디버깅 코드 끝 ---

    // 2. 비밀번호 비교
    const isPasswordMatched = await bcrypt.compare(pass, localAuth.passwordHash);

    // --- 임시 디버깅 코드 시작 ---
    console.log('Comparison Result (isPasswordMatched):', isPasswordMatched);
    console.log('---------------------------');
    // --- 임시 디버깅 코드 끝 ---

    if (!isPasswordMatched) {
      // 비밀번호가 틀렸을 경우, 명시적으로 UnauthorizedException 발생
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    return localAuth.user;
  }

  // 로그인 성공 시 JWT 발급
  async login(user: User) {
    const payload = { email: user.email, sub: user.userId, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
