import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '../../db/db';
import { users } from '../../db/schema/user/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { AppleAuthCredential } from './interfaces/apple-auth.interface';
import * as jwt from 'jsonwebtoken';

export type UserData = {
  id: number;
  username: string;
  email: string;
  password: string;
  appleUserId: string | null;
  profileImage: string | null;
  bio: string | null;
  role: string;
  rating: number | null;
  premium: boolean | null;
  godmode: boolean | null;
  followers: number | null;
  following: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface JwtPayload {
  email: string;
  sub: number;
}

interface AppleIdTokenPayload {
  sub: string; // The unique identifier for the user
  email?: string; // The user's email address
  email_verified?: boolean;
  is_private_email?: boolean;
  auth_time: number; // The time when authentication occurred
  nonce_supported: boolean;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserData, 'password'> | null> {
    const user = (await db.query.users.findFirst({
      where: eq(users.email, email),
    })) as UserData | null;

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: omittedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<UserData, 'password'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1y',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(email: string, password: string, username: string) {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        username,
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omittedPassword, ...userWithoutPassword } = newUser[0];
    return this.login(userWithoutPassword);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.sub),
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: omittedPassword, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async handleAppleSignIn(credential: AppleAuthCredential) {
    try {
      // Verify the identity token
      const jwtLib = jwt as {
        decode(token: string, options: { json: true }): unknown;
      };
      const decodedToken = jwtLib.decode(credential.identityToken, {
        json: true,
      }) as AppleIdTokenPayload | null;

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid Apple ID token');
      }

      // Check if user exists by Apple user ID
      let user = (await db.query.users.findFirst({
        where: eq(users.appleUserId, credential.user),
      })) as UserData | null;

      if (!user) {
        // If user doesn't exist, create a new one
        const username = credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : `apple_${credential.user.substring(0, 8)}`;

        const newUser = await db
          .insert(users)
          .values({
            email:
              credential.email || `${credential.user}@privaterelay.appleid.com`,
            password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Apple users
            username,
            appleUserId: credential.user,
          })
          .returning();

        user = newUser[0];
      }

      // Login the user
      if (!user) {
        throw new UnauthorizedException('Failed to create or find user');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: omittedPassword, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch (err) {
      console.error('Apple authentication failed:', err);
      throw new UnauthorizedException('Apple authentication failed');
    }
  }
}
