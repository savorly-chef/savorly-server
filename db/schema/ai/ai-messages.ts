import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { aiConversations } from './ai-conversations';

// AI Messages table
export const aiMessages = sqliteTable(
  'ai_messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    conversationId: integer('conversation_id')
      .notNull()
      .references(() => aiConversations.id, { onDelete: 'cascade' }),
    isUser: integer('is_user', { mode: 'boolean' }).notNull(),
    content: text('content').notNull(),
    metadata: text('metadata'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    conversationCreatedAtIdx: index('conversation_created_at_idx').on(
      table.conversationId,
      table.createdAt,
    ),
  }),
);
