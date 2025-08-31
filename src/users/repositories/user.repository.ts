import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LocalAuth } from '../entities/local-auth.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SocialAuth } from '../entities/social-auth.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

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

  async createSocialUser(profile: { provider: string; providerUserId: string; email?: string; name?: string }): Promise<User> {
    const { provider, providerUserId, email, name } = profile;
    const userName = name || (email ? email.split('@')[0] : 'social_user');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = this.create({ name: userName, email });
      user.user_id = uuidv4(); // Manually generate UUID
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

  async linkSocialAuth(user: User, profile: { provider: string; providerUserId: string }): Promise<SocialAuth> {
    const { provider, providerUserId } = profile;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const socialAuth = new SocialAuth();
      socialAuth.provider = provider;
      socialAuth.providerUserId = providerUserId;
      socialAuth.user = user;
      await queryRunner.manager.save(socialAuth);
      await queryRunner.commitTransaction();
      return socialAuth;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.findOneBy({ user_id: userId });
  }
}