import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
