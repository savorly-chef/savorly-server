import { db } from './db';
import { users } from './schema/user/users';
import { recipes } from './schema/recipe/recipes';
import { recipeTypes } from './schema/recipe/recipe-types';

import { seedUsers } from './seeds/users';
import { seedSettings } from './seeds/settings';
import { seedFollows } from './seeds/follows';
import { seedRecipeTypes } from './seeds/recipe-types';
import { seedRecipes } from './seeds/recipes';
import { seedRecipeImages } from './seeds/recipe-images';
import { seedAiFeatures } from './seeds/ai-features';
import { seedAiConversations } from './seeds/ai-conversations';
import { seedAiMessages } from './seeds/ai-messages';
import { seedUserInteractions } from './seeds/user-interactions';
import { seedLikes } from './seeds/likes';
import { seedRecipeStats } from './seeds/recipe-stats';
import { seedRecipeTrendingHistory } from './seeds/recipe-trending-history';

type User = typeof users.$inferSelect;
type Recipe = typeof recipes.$inferSelect;
type RecipeType = typeof recipeTypes.$inferSelect;

type DbResult<T> = T[] | Error;

const { log, error } = console;

const runSeeds = async () => {
  log('🌱 Starting seeding...');

  try {
    // Seed users and user-related tables
    log('Seeding users...');
    const seededUsers = (await seedUsers(db)) as DbResult<User>;
    if (seededUsers instanceof Error || !seededUsers.length)
      throw new Error('Failed to seed users');
    const users = seededUsers;

    log('Seeding user settings...');
    await seedSettings(db, users);

    log('Seeding user follows...');
    await seedFollows(db, users);

    // Seed recipes and recipe-related tables
    log('Seeding recipe types...');
    const seededRecipeTypes = (await seedRecipeTypes(
      db,
    )) as DbResult<RecipeType>;
    if (seededRecipeTypes instanceof Error || !seededRecipeTypes.length)
      throw new Error('Failed to seed recipe types');
    const recipeTypes = seededRecipeTypes;

    log('Seeding recipes...');
    const seededRecipes = (await seedRecipes(
      db,
      users,
      recipeTypes,
    )) as DbResult<Recipe>;
    if (seededRecipes instanceof Error || !seededRecipes.length)
      throw new Error('Failed to seed recipes');
    const recipes = seededRecipes;

    log('Seeding recipe images...');
    await seedRecipeImages(db, recipes);

    // Seed AI-related tables
    log('Seeding AI features...');
    const aiFeatures = await seedAiFeatures(db);

    log('Seeding AI conversations...');
    const aiConversations = await seedAiConversations(db, users, aiFeatures);

    log('Seeding AI messages...');
    await seedAiMessages(db, aiConversations);

    // Seed interaction and stats tables
    log('Seeding user interactions...');
    await seedUserInteractions(db, users, recipes);

    log('Seeding likes...');
    await seedLikes(db, users, recipes);

    log('Seeding recipe stats...');
    await seedRecipeStats(db, recipes);

    log('Seeding recipe trending history...');
    await seedRecipeTrendingHistory(db, recipes);

    log('✅ Seeding completed successfully!');
  } catch (err: unknown) {
    if (err instanceof Error) {
      error('❌ Error during seeding:', err.message);
    } else {
      error('❌ Unknown error during seeding');
    }
    process.exit(1);
  }

  process.exit(0);
};

runSeeds();
