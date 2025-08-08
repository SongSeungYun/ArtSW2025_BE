import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { LocalAuth } from './entities/local-auth.entity';
import { UserRepository } from './repositories/user.repository';
import { LocalAuthRepository } from './repositories/local-auth.repository';
// UsersController는 현재 사용하지 않으므로 주석 처리 또는 삭제 가능
// import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, LocalAuth]), // 엔티티 등록
  ],
  // controllers: [UsersController], // 필요시 활성화
  providers: [UsersService, UserRepository, LocalAuthRepository],
  exports: [UsersService, UserRepository, LocalAuthRepository], // 다른 모듈에서 사용 가능
})
export class UsersModule {}
