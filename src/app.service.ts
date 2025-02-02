import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion() {
    return {
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      apiVersion: 'v1',
    };
  }
}
