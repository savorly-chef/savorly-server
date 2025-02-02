import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { log } = console;

async function bootstrap() {
  // For Fly.io deployment, we need to use port 8080
  const port =
    process.env.NODE_ENV === 'production' ? 8080 : (process.env.PORT ?? 3000);
  const env = process.env.NODE_ENV ?? 'development';

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Listen on all network interfaces
  await app.listen(port, '0.0.0.0');

  if (env === 'development') log(`Server is running on port ${port}`);
}

bootstrap().catch((error) => console.error(error));
