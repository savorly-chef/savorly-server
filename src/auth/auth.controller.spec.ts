import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    appleUserId: null,
    profileImage: null,
    bio: null,
    role: 'user',
    rating: 0,
    premium: false,
    godmode: false,
    followers: 0,
    following: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const expectedResponse = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await authController.register(
        registerDto.email,
        registerDto.password,
        registerDto.username,
      );

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.username,
      );
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const expectedResponse = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const req = { user: mockUser };
      const result = await authController.login(req);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';
      const expectedResponse = {
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await authController.refreshToken(refreshToken);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw UnauthorizedException when refresh token is missing', () => {
      expect(() => {
        throw new UnauthorizedException('Refresh token is required');
      }).toThrow(UnauthorizedException);
    });
  });
});
