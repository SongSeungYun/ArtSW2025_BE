import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
  ) {}

  async sendVerificationEmail(email: string): Promise<void> {
    const existingUser = await this.usersService.findUserByEmail(email).catch(() => null);
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const key = `email_verification:${email}`;
    await this.redisService.set(key, code, 300); // 5분간 유효

    await this.emailQueue.add('send-verification', {
      to: email,
      subject: '[Your App] 이메일 인증 코드 안내',
      template: './verification',
      context: {
        name: email, // 실제로는 name을 받아오거나 해야 함
        code,
      },
    });
  }

  async checkVerificationCode(email: string, code: string): Promise<void> {
    const key = `email_verification:${email}`;
    const storedCode = await this.redisService.get(key);

    if (!storedCode) {
      throw new UnauthorizedException('인증 코드가 만료되었거나 존재하지 않습니다.');
    }

    if (storedCode !== code) {
      throw new UnauthorizedException('인증 코드가 일치하지 않습니다.');
    }

    const verifiedKey = `verified_email:${email}`;
    await this.redisService.set(verifiedKey, 'true', 600); // 10분간 유효
    await this.redisService.del(key); // 사용된 인증 코드는 삭제
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const verifiedKey = `verified_email:${createUserDto.email}`;
    const isVerified = await this.redisService.get(verifiedKey);

    if (!isVerified) {
      throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
    }

    const user = await this.usersService.createUser(createUserDto);
    await this.redisService.del(verifiedKey); // 사용된 증표는 삭제
    return user;
  }

  async validateUser(loginId: string, pass: string): Promise<User> {
    const localAuth = await this.usersService.findLocalAuthByLoginId(loginId);
    const isPasswordMatched = await bcrypt.compare(pass, localAuth.passwordHash);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    return localAuth.user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.userId, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
