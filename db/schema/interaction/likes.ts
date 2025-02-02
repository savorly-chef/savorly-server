import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { users } from '../user/users';

// Likes table
export const likes = sqliteTable(
  'likes',
  {
    id: integer('id', { mode: 'number' }).notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    likeableType: text('likeable_type').notNull(),
    likeableId: integer('likeable_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: primaryKey({
      columns: [table.userId, table.likeableType, table.likeableId],
    }),
    likeableIdx: index('likeable_idx').on(table.likeableType, table.likeableId),
  }),
);
