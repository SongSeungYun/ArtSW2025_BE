import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SocialAuth } from '../entities/social-auth.entity';

@Injectable()
export class SocialAuthRepository extends Repository<SocialAuth> {
  constructor(private dataSource: DataSource) {
    super(SocialAuth, dataSource.createEntityManager());
  }

  async findByProviderId(provider: string, providerUserId: string): Promise<SocialAuth | null> {
    return this.findOne({
      where: { provider, providerUserId },
      relations: ['user'],
    });
  }
}
