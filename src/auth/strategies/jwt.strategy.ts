import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // HTTP 헤더에서 Bearer 토큰 추출
      ignoreExpiration: false, // 만료된 토큰은 인증 거부
      secretOrKey: configService.get<string>('JWT_SECRET'), // .env 환경변수의 비밀키 사용
    });
  }

  // JWT 검증 후 실행: 페이로드에 있는 사용자 ID로 DB에서 최신 사용자 정보 조회 가능
  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      return null; // DB에 사용자가 없으면 인증 실패 처리
    }
    // req.user에 저장될 정보 리턴 (필요한 정보만 선별)
    return { userId: user.userId, email: user.email, name: user.name };
  }
}
