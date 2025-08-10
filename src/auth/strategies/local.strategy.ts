import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 기본적으로 Passport는 username 필드로 인증 정보를 받으나,
    // 우리는 loginId로 변경 설정
    super({ 
      usernameField: 'loginId',
      passwordField: 'password_hash' // 비밀번호 필드 이름 명시
    });
  }

  // Passport가 인증 시 자동으로 호출하는 메서드
  async validate(loginId: string, password_hash: string): Promise<any> {
    // AuthService.validateUser는 실패 시 예외를 던지므로, try-catch가 없는 한
    // 예외는 자동으로 전파됩니다. 성공 시에만 user 객체가 반환됩니다.
    const user = await this.authService.validateUser(loginId, password_hash);
    return user;
  }
}
