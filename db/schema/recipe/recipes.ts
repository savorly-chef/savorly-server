import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from '../user/users';
import { recipeTypes } from './recipe-types';
import { recipeImages } from './recipe-images';

// Recipes table
export const recipes = sqliteTable(
  'recipes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    typeId: integer('type_id').references(() => recipeTypes.id),
    preparationTime: integer('preparation_time'),
    cookingTime: integer('cooking_time'),
    difficultyLevel: text('difficulty_level'),
    servings: integer('servings'),
    status: text('status').notNull().default('draft'),
    thumbnailImageId: integer('thumbnail_image_id').references(
      () => recipeImages.id,
    ),
    searchVector: text('search_vector'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userStatusIdx: index('user_status_idx').on(table.userId, table.status),
    typeStatusIdx: index('type_status_idx').on(table.typeId, table.status),
    difficultyStatusIdx: index('difficulty_status_idx').on(
      table.difficultyLevel,
      table.status,
    ),
    searchVectorIdx: index('search_vector_idx').on(table.searchVector),
  }),
);
