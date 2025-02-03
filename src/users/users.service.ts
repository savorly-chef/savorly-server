import { Injectable } from '@nestjs/common';
import { db } from '../../db/db';
import { users } from '../../db/schema/user/users';
import { eq } from 'drizzle-orm';

export interface UpdateUserInput {
  email?: string;
  password?: string;
  followers?: number;
  following?: number;
  language?: string;
  username?: string;
  bio?: string;
  profileImage?: string;
}

@Injectable()
export class UsersService {
  async updateUser(userId: number, updateData: UpdateUserInput) {
    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser[0];
  }

  async findById(userId: number) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
}
