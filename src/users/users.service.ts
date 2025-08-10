import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { LocalAuthRepository } from './repositories/local-auth.repository';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './entities/user.entity';
import { LocalAuth } from './entities/local-auth.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly localAuthRepository: LocalAuthRepository,
  ) {}

  // 사용자 생성 요청을 레포지토리로 전달
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUserAndLocalAuth(createUserDto);
  }

  // 로그인 ID로 LocalAuth 정보 찾는 요청을 레포지토리로 전달
  async findLocalAuthByLoginId(loginId: string): Promise<LocalAuth> {
    const localAuth = await this.localAuthRepository.findByLoginId(loginId);
    if (!localAuth) {
      throw new NotFoundException(`Auth data for login ID "${loginId}" not found`);
    }
    return localAuth;
  }

  // 사용자 ID로 User 정보 찾는 요청을 레포지토리로 전달
  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }
}
