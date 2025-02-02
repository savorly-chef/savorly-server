import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { recipeStats } from '../schema/stats/recipe-stats';
import { recipes } from '../schema/recipe/recipes';

type Recipe = typeof recipes.$inferSelect;
type RecipeStat = typeof recipeStats.$inferInsert;

const generateRecipeStats = (recipes: Recipe[]) => {
  return recipes.map(
    (recipe): RecipeStat => ({
      recipeId: recipe.id,
      viewsCount: Math.floor(Math.random() * 1000),
      likesCount: Math.floor(Math.random() * 100),
      savesCount: Math.floor(Math.random() * 50),
      commentsCount: Math.floor(Math.random() * 30),
      averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
      totalCookingTime: Math.floor(Math.random() * 100),
      ingredientsCount: Math.floor(Math.random() * 10),
      lastInteractionAt: new Date(),
      popularityScore: Math.random(),
      trendingScore: Math.random(),
      recentViews24h: Math.floor(Math.random() * 100),
      recentLikes24h: Math.floor(Math.random() * 10),
      recentSaves24h: Math.floor(Math.random() * 5),
      recentComments24h: Math.floor(Math.random() * 5),
      recentRatings24h: Math.floor(Math.random() * 3),
    }),
  );
};

export const seedRecipeStats = async (
  db: LibSQLDatabase,
  recipes: Recipe[],
) => {
  console.log('Inserting recipe stats...');
  const statsToInsert = generateRecipeStats(recipes);
  const insertedStats = await db
    .insert(recipeStats)
    .values(statsToInsert)
    .returning();
  return insertedStats;
};
