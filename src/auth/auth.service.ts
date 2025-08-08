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
  async validateUser(loginId: string, pass: string): Promise<User | null> {
    const localAuth = await this.usersService.findLocalAuthByLoginId(loginId);

    if (localAuth && (await bcrypt.compare(pass, localAuth.passwordHash))) {
      return localAuth.user; // 비밀번호 일치 시 User 객체 반환
    }
    return null; // 일치하지 않으면 null 반환
  }

  // 로그인 성공 시 JWT 발급
  async login(user: User) {
    const payload = { email: user.email, sub: user.userId, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
