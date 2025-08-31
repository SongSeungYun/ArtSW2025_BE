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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUserAndLocalAuth(createUserDto);
  }

  async createSocialUser(profile: { provider: string; providerUserId: string; email?: string; name?: string }): Promise<User> {
    return this.userRepository.createSocialUser(profile);
  }

  async findLocalAuthByLoginId(loginId: string): Promise<LocalAuth> {
    const localAuth = await this.localAuthRepository.findByLoginId(loginId);
    if (!localAuth) {
      throw new NotFoundException(`Auth data for login ID "${loginId}" not found`);
    }
    return localAuth;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async linkSocialProfile(user: User, profile: { provider: string; providerUserId: string; }) {
    return this.userRepository.linkSocialAuth(user, profile);
  }
}