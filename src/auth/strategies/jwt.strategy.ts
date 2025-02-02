import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { db } from '../../../db/db';
import { users } from '../../../db/schema/user/users';
import { eq } from 'drizzle-orm';
import { JwtPayload, UserData } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = (await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    })) as UserData | null;

    if (!user) {
      return null;
    }

    const { ...result } = user;
    return result;
  }
}
