import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({  // Setting validation globally
    whitelist: true,  // No other fields which we dont define
  }));
  await app.listen(3000);
}
bootstrap();
