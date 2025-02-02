import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { likes } from '../schema/interaction/likes';
import { users } from '../schema/user/users';
import { recipes } from '../schema/recipe/recipes';

type User = typeof users.$inferSelect;
type Recipe = typeof recipes.$inferSelect;
type Like = typeof likes.$inferInsert;

const generateLikes = (users: User[], recipes: Recipe[]) => {
  const likeEntries: Like[] = [];
  let id = 1;

  // Each user likes some recipes
  for (const user of users) {
    // Each user likes 2-4 random recipes
    const numLikes = Math.floor(Math.random() * 3) + 2;
    const shuffledRecipes = [...recipes].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numLikes && i < shuffledRecipes.length; i++) {
      likeEntries.push({
        id: id++,
        userId: user.id,
        likeableType: 'recipe',
        likeableId: shuffledRecipes[i].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return likeEntries;
};

export const seedLikes = async (
  db: LibSQLDatabase,
  users: User[],
  recipes: Recipe[],
) => {
  console.log('Inserting likes...');
  const likesToInsert = generateLikes(users, recipes);
  const insertedLikes = await db
    .insert(likes)
    .values(likesToInsert)
    .returning();
  return insertedLikes;
};
