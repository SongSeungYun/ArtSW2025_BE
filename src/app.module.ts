import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';


import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { BullModule } from '@nestjs/bullmq';
import { TutorialsModule } from './tutorials/tutorials.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { BoardsModule } from './boards/boards.module';

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
      ssl : process.env.DB_SSL === 'true',
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: true, // 다시 false로 설정
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Your App Name" <${configService.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT')),
        },
      }),
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    RedisModule,
    TutorialsModule,
    QuizzesModule,
    UserProgressModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
