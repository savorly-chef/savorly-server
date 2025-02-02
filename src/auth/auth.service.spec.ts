import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { db } from '../../db/db';

type MockDb = {
  query: {
    users: {
      findFirst: jest.Mock;
    };
  };
  insert: jest.Mock;
  values: jest.Mock;
  returning: jest.Mock;
};

// Mock the database module
jest.mock('../../db/db', () => {
  const mockDb: MockDb = {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  };
  return { db: mockDb };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockDb: MockDb;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test_token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    mockDb = jest.mocked(db) as unknown as MockDb;
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should return null when user is not found', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(null);

      const result = await service.validateUser(
        'wrong@example.com',
        'password123',
      );
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = {
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

      const result = await service.login(user);

      expect(result).toEqual({
        access_token: 'test_token',
        refresh_token: 'test_token',
      });
      const signAsyncCalls = (jwtService.signAsync as jest.Mock).mock.calls
        .length;
      expect(signAsyncCalls).toBe(2);
    });
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(null);
      mockDb.returning.mockResolvedValue([mockUser]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const result = await service.register(
        'test@example.com',
        'password123',
        'testuser',
      );

      expect(result).toEqual({
        access_token: 'test_token',
        refresh_token: 'test_token',
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const payload = { sub: 1, email: 'test@example.com' };

      (jwtService.verify as jest.Mock).mockReturnValue(payload);
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.refreshToken('valid_refresh_token');

      expect(result).toEqual({
        access_token: 'test_token',
        refresh_token: 'test_token',
      });
    });
  });
});
