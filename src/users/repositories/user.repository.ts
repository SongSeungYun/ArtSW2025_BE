import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LocalAuth } from '../entities/local-auth.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 회원가입: User와 LocalAuth를 트랜잭션으로 함께 생성
  async createUserAndLocalAuth(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, loginId, password_hash } = createUserDto;

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. User 엔티티 생성 및 저장
      const user = this.create({ name, email });
      await queryRunner.manager.save(user);

      // 2. LocalAuth 엔티티 생성 및 저장
      const localAuth = new LocalAuth();
      localAuth.loginId = loginId;
      localAuth.passwordHash = hashedPassword;
      localAuth.user = user; // User와 관계 설정
      await queryRunner.manager.save(localAuth);

      // 트랜잭션 성공 시 커밋
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      // 에러 발생 시 롤백
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 쿼리 러너 연결 해제
      await queryRunner.release();
    }
  }

  // 사용자 ID로 사용자 찾기
  async findUserById(userId: string): Promise<User | null> {
    return this.findOneBy({ userId });
  }
}
