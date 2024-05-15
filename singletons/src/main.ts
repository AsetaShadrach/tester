import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: true,
      errorHttpStatusCode: 422, // Unprocessable entity -> for invalid payloads
    }),
  );
  await app.listen(3000);
}
bootstrap();
