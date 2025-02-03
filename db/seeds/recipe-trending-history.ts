import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { recipeTrendingHistory } from '../schema/stats/recipe-trending-history';
import { recipes } from '../schema/recipe/recipes';

type Recipe = typeof recipes.$inferSelect;
type TrendingHistory = typeof recipeTrendingHistory.$inferInsert;

const generateTrendingHistory = (recipes: Recipe[]): TrendingHistory[] => {
  const history: TrendingHistory[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - i);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 1);

    const numTrending = Math.floor(Math.random() * 2) + 2;
    const shuffledRecipes: Recipe[] = [...recipes];
    shuffledRecipes.sort(() => Math.random() - 0.5);

    for (let j = 0; j < numTrending && j < shuffledRecipes.length; j++) {
      history.push({
        recipeId: shuffledRecipes[j].id,
        trendingScore: Math.floor(Math.random() * 50 + 50),
        viewsCount: Math.floor(Math.random() * 100),
        savesCount: Math.floor(Math.random() * 20),
        commentsCount: Math.floor(Math.random() * 10),
        ratingsCount: Math.floor(Math.random() * 15),
        periodStart,
        periodEnd,
      });
    }
  }

  return history;
};

export const seedRecipeTrendingHistory = async (
  db: LibSQLDatabase,
  recipes: Recipe[],
) => {
  console.log('Inserting recipe trending history...');
  const historyToInsert = generateTrendingHistory(recipes);
  const insertedHistory = await db
    .insert(recipeTrendingHistory)
    .values(historyToInsert)
    .returning();
  return insertedHistory;
};
