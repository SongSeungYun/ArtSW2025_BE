import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('KAKAO_CLIENT_ID');
    const clientSecret = configService.get<string>('KAKAO_CLIENT_SECRET'); // Client Secret 가져오기

    if (!clientID || !clientSecret) { // Client Secret 존재 여부도 함께 확인
      throw new Error('Kakao clientID or clientSecret is not defined.');
    }

    super({
      clientID,
      clientSecret, // Client Secret 전달
      callbackURL: 'http://localhost:3000/auth/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username, _json } = profile;
    const provider = 'kakao';

    const user = await this.authService.validateSocialUser({
      provider,
      providerUserId: id.toString(),
      email: _json.kakao_account?.email,
      name: username,
    });

    return user;
  }
}
