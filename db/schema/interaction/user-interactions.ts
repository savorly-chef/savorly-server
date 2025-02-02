import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from '../user/users';
import { recipes } from '../recipe/recipes';

// User Interactions table
export const userInteractions = sqliteTable(
  'user_interactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    interactionType: text('interaction_type').notNull(),
    durationSeconds: integer('duration_seconds'),
  },
  (table) => ({
    userRecipeIdx: index('user_recipe_idx').on(table.userId, table.recipeId),
    userTypeIdx: index('user_type_idx').on(table.userId, table.interactionType),
    recipeTypeIdx: index('recipe_type_idx').on(
      table.recipeId,
      table.interactionType,
    ),
  }),
);
