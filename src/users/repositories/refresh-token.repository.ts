import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(private dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async createRefreshToken(user: User, hashedToken: string, ttl: number): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + ttl);

    // 한 사용자는 하나의 리프레시 토큰만 갖도록 기존 토큰은 삭제 (선택적 로직)
    await this.delete({ user: { userId: user.userId } });

    const refreshToken = this.create({
      user,
      hashedRefreshToken: hashedToken,
      expiresAt,
    });

    await this.save(refreshToken);
    return refreshToken;
  }
}
