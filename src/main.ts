import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register the global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Register the global interceptor for successful responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Register the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 막음
      transform: true, // 요청 데이터를 DTO 타입으로 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
