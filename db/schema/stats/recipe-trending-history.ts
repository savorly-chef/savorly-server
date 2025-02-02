import { sqliteTable, integer, real, index } from 'drizzle-orm/sqlite-core';
import { recipes } from '../recipe/recipes';

// Recipe Trending History table
export const recipeTrendingHistory = sqliteTable(
  'recipe_trending_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    trendingScore: real('trending_score').notNull(),
    viewsCount: integer('views_count').notNull(),
    savesCount: integer('saves_count').notNull(),
    commentsCount: integer('comments_count').notNull(),
    ratingsCount: integer('ratings_count').notNull(),
    periodStart: integer('period_start', { mode: 'timestamp' }).notNull(),
    periodEnd: integer('period_end', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    recipePeriodIdx: index('recipe_period_idx').on(
      table.recipeId,
      table.periodStart,
    ),
    periodTrendingIdx: index('period_trending_idx').on(
      table.periodStart,
      table.trendingScore,
    ),
  }),
);
