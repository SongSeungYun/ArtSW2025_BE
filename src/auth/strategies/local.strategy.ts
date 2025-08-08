import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 기본적으로 Passport는 username 필드로 인증 정보를 받으나,
    // 우리는 loginId로 변경 설정
    super({ usernameField: 'loginId' });
  }

  // Passport가 인증 시 자동으로 호출하는 메서드
  async validate(loginId: string, password_hash: string): Promise<any> {
    // AuthService의 validateUser를 통해 사용자와 비밀번호 검증
    const user = await this.authService.validateUser(loginId, password_hash);

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    // 검증 성공 시 user 객체를 반환하며, req.user에 저장됨
    return user;
  }
}
