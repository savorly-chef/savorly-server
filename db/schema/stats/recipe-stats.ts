import { sqliteTable, integer, real, index } from 'drizzle-orm/sqlite-core';
import { recipes } from '../recipe/recipes';

// Recipe Statistics table
export const recipeStats = sqliteTable(
  'recipe_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    recipeId: integer('recipe_id')
      .notNull()
      .unique()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    viewsCount: integer('views_count').notNull().default(0),
    savesCount: integer('saves_count').notNull().default(0),
    likesCount: integer('likes_count').notNull().default(0),
    commentsCount: integer('comments_count').notNull().default(0),
    averageRating: real('average_rating').notNull().default(0),
    totalCookingTime: integer('total_cooking_time'),
    ingredientsCount: integer('ingredients_count').notNull().default(0),
    lastInteractionAt: integer('last_interaction_at', { mode: 'timestamp' }),
    popularityScore: real('popularity_score').notNull().default(0),
    trendingScore: real('trending_score').notNull().default(0),
    recentViews24h: integer('recent_views_24h').notNull().default(0),
    recentSaves24h: integer('recent_saves_24h').notNull().default(0),
    recentLikes24h: integer('recent_likes_24h').notNull().default(0),
    recentComments24h: integer('recent_comments_24h').notNull().default(0),
    recentRatings24h: integer('recent_ratings_24h').notNull().default(0),
  },
  (table) => ({
    popularityScoreIdx: index('popularity_score_idx').on(table.popularityScore),
    trendingScoreIdx: index('trending_score_idx').on(table.trendingScore),
    viewsCountIdx: index('views_count_idx').on(table.viewsCount),
    likesCountIdx: index('likes_count_idx').on(table.likesCount),
    averageRatingIdx: index('average_rating_idx').on(table.averageRating),
    lastInteractionAtIdx: index('last_interaction_at_idx').on(
      table.lastInteractionAt,
    ),
    recentActivityIdx: index('recent_activity_idx').on(
      table.recentViews24h,
      table.recentSaves24h,
      table.recentComments24h,
      table.recentLikes24h,
    ),
  }),
);
