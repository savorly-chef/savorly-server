import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { userInteractions } from '../schema/interaction/user-interactions';
import { users } from '../schema/user/users';
import { recipes } from '../schema/recipe/recipes';

type User = typeof users.$inferSelect;
type Recipe = typeof recipes.$inferSelect;
type UserInteraction = typeof userInteractions.$inferInsert;

const generateInteractions = (
  users: User[],
  recipes: Recipe[],
): UserInteraction[] => {
  const interactions: UserInteraction[] = [];

  // Generate some interactions for each user
  for (const user of users) {
    // Each user interacts with 2-3 random recipes
    const numInteractions = Math.floor(Math.random() * 2) + 2;
    const shuffledRecipes = [...recipes];
    shuffledRecipes.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numInteractions && i < shuffledRecipes.length; i++) {
      const recipe: Recipe = shuffledRecipes[i];
      interactions.push({
        userId: user.id,
        recipeId: recipe.id,
        interactionType: Math.random() > 0.5 ? 'view' : 'save',
        durationSeconds: Math.floor(Math.random() * 1000),
      });
    }
  }

  return interactions;
};

export const seedUserInteractions = async (
  db: LibSQLDatabase,
  users: User[],
  recipes: Recipe[],
) => {
  console.log('Inserting user interactions...');
  const interactionsToInsert = generateInteractions(users, recipes);
  const insertedInteractions = await db
    .insert(userInteractions)
    .values(interactionsToInsert)
    .returning();
  return insertedInteractions;
};
