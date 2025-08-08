import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LocalAuth } from '../entities/local-auth.entity';

@Injectable()
export class LocalAuthRepository extends Repository<LocalAuth> {
  constructor(private dataSource: DataSource) {
    super(LocalAuth, dataSource.createEntityManager());
  }

  // 로그인 ID로 LocalAuth 정보 찾기 (연관된 User 정보 포함)
  async findByLoginId(loginId: string): Promise<LocalAuth | null> {
    return this.findOne({
      where: { loginId },
      relations: ['user'], // User 엔티티를 함께 로드
    });
  }
}
