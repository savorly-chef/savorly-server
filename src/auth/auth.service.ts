import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '../../db/db';
import { users } from '../../db/schema/user/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

export interface UserData {
  id: number;
  email: string;
  password: string;
  username: string;
}

export interface JwtPayload {
  email: string;
  sub: number;
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
      const { ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<UserData, 'password'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token valid for 7 days
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

    return this.login(newUser[0]);
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

      const { ...result } = user;
      return this.login(result);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
