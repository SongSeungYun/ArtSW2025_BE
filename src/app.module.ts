import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ControllerModule } from './controller/controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: true, // 개발 환경에서만 true로 설정 (DB 자동 동기화)
    }),
    UsersModule,
    AuthModule,
    ControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
