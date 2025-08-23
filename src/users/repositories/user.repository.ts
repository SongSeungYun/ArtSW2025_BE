import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LocalAuth } from '../entities/local-auth.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SocialAuth } from '../entities/social-auth.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 로컬 회원가입: User와 LocalAuth를 트랜잭션으로 함께 생성
  async createUserAndLocalAuth(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, loginId, password_hash } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.create({ name, email });
      await queryRunner.manager.save(user);

      const localAuth = new LocalAuth();
      localAuth.loginId = loginId;
      localAuth.passwordHash = hashedPassword;
      localAuth.user = user;
      await queryRunner.manager.save(localAuth);

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 소셜 로그인 사용자를 위한 생성 메서드
  async createSocialUser(profile: { provider: string; providerUserId: string; email?: string; name?: string }): Promise<User> {
    const { provider, providerUserId, email, name } = profile;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.create({ name, email });
      await queryRunner.manager.save(user);

      const socialAuth = new SocialAuth();
      socialAuth.provider = provider;
      socialAuth.providerUserId = providerUserId;
      socialAuth.user = user;
      await queryRunner.manager.save(socialAuth);

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 사용자 ID로 사용자 찾기
  async findUserById(userId: string): Promise<User | null> {
    return this.findOneBy({ user_id: parseInt(userId, 10) });
  }
}