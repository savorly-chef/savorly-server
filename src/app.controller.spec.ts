import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('version', () => {
    it('should return version info', () => {
      const mockVersion = {
        version: '1.0.0',
        environment: 'test',
        apiVersion: 'v1',
      };

      jest
        .spyOn(appService, 'getVersion')
        .mockImplementation(() => mockVersion);

      const result = appController.getVersion();
      expect(result).toEqual(mockVersion);
    });
  });
});
