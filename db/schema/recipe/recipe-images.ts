import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { recipes } from './recipes';

// Recipe Images table
export const recipeImages = sqliteTable('recipe_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').references(() => recipes.id, {
    onDelete: 'cascade',
  }),
  url: text('url').notNull(),
  storageKey: text('storage_key').notNull(),
  altText: text('alt_text'),
  position: integer('position').default(0),
  width: integer('width'),
  height: integer('height'),
  size: integer('size'),
  mimeType: text('mime_type'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
