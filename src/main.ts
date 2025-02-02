import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { log } = console;

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const env = process.env.NODE_ENV ?? 'development';

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(port);

  if (env === 'development') log(`Server is running on port ${port}`);
}

bootstrap().catch((error) => console.error(error));
