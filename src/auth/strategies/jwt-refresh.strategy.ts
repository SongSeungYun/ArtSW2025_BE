import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenRepository } from 'src/users/repositories/refresh-token.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    const secretOrKey = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_REFRESH_SECRET is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const userRefreshToken = await this.refreshTokenRepository.findOneBy({ user: { user_id: user.user_id } });
    if (!userRefreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.');
    }

    return user;
  }
}
