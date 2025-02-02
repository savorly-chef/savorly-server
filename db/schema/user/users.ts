import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  appleUserId: text('apple_user_id').unique(),
  profileImage: text('profile_image'),
  bio: text('bio'),
  role: text('role').notNull().default('user'),
  rating: real('rating').default(0),
  premium: integer('premium', { mode: 'boolean' }).default(false),
  godmode: integer('godmode', { mode: 'boolean' }).default(false),
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
