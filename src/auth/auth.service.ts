import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '../redis/redis.service';
import { SocialAuthRepository } from '../users/repositories/social-auth.repository';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from '../users/repositories/refresh-token.repository';
import { SocialAuth } from '../users/entities/social-auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly socialAuthRepository: SocialAuthRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    await this.redisService.set(key, code, 300);
    await this.emailQueue.add('send-verification', {
      to: email,
      subject: '[Your App] 이메일 인증 코드 안내',
      template: './verification',
      context: { name: email, code },
    });
  }

  async checkVerificationCode(email: string, code: string): Promise<void> {
    const key = `email_verification:${email}`;
    const storedCode = await this.redisService.get(key);
    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException('인증 코드가 유효하지 않습니다.');
    }
    const verifiedKey = `verified_email:${email}`;
    await this.redisService.set(verifiedKey, 'true', 600);
    await this.redisService.del(key);
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const verifiedKey = `verified_email:${createUserDto.email}`;
    const isVerified = await this.redisService.get(verifiedKey);
    if (!isVerified) {
      throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
    }
    const user = await this.usersService.createUser(createUserDto);
    await this.redisService.del(verifiedKey);
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

  async validateSocialUser(profile: { provider: string; providerUserId: string; email?: string; name?: string }): Promise<User> {
    const { provider, providerUserId, email } = profile;

    const existingSocialAuth = await this.socialAuthRepository.findByProviderId(provider, providerUserId);
    if (existingSocialAuth) {
      return existingSocialAuth.user;
    }

    if (email) {
      const existingUser = await this.usersService.findUserByEmail(email).catch(() => null);
      if (existingUser) {
        await this.usersService.linkSocialProfile(existingUser, { provider, providerUserId });
        return existingUser;
      }
    }

    return this.usersService.createSocialUser(profile);
  }

  private async issueTokens(user: User) {
    const payload = { email: user.email, sub: user.user_id, name: user.name };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });

    const refreshTokenPayload = { ...payload, tokenType: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenTtlInSeconds = 7 * 24 * 60 * 60; // 7일
    await this.refreshTokenRepository.createRefreshToken(user, hashedRefreshToken, refreshTokenTtlInSeconds);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: User) {
    return this.issueTokens(user);
  }

  async socialLogin(user: User) {
    return this.issueTokens(user);
  }

  async refreshAccessToken(user: User) {
    const payload = { email: user.email, sub: user.user_id, name: user.name };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });

    return { access_token: accessToken };
  }
}
