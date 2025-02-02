import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from '../user/users';
import { recipes } from '../recipe/recipes';
import { aiFeatures } from './ai-features';

// AI Conversations table
export const aiConversations = sqliteTable(
  'ai_conversations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    featureId: integer('feature_id')
      .notNull()
      .references(() => aiFeatures.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id').references(() => recipes.id, {
      onDelete: 'set null',
    }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userCreatedAtIdx: index('ai_conv_user_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
  }),
);
