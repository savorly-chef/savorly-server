import { sql } from 'drizzle-orm';
import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { users } from './users';

// Follows table
export const follows = sqliteTable(
  'follows',
  {
    followingUserId: integer('following_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followedUserId: integer('followed_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followingUserId, table.followedUserId] }),
  }),
);
