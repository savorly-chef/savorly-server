import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { recipes } from '../schema/recipe/recipes';
import { users } from '../schema/user/users';
import { recipeTypes } from '../schema/recipe/recipe-types';

type User = typeof users.$inferSelect;
type RecipeType = typeof recipeTypes.$inferSelect;
type Recipe = typeof recipes.$inferInsert;

const generateRecipes = (users: User[], recipeTypes: RecipeType[]) => {
  const sampleRecipes: Recipe[] = [
    {
      title: 'Classic Beef Wellington',
      description:
        'A luxurious dish of beef tenderloin wrapped in mushroom duxelles and puff pastry',
      userId: users[0].id, // Gordon Ramsay
      typeId: recipeTypes.find((t) => t.slug === 'main-course')?.id,
      preparationTime: 90,
      cookingTime: 45,
      difficultyLevel: 'hard',
      servings: 6,
      status: 'published',
      searchVector: 'beef wellington mushroom pastry luxury dinner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'French Onion Soup',
      description:
        'Traditional French onion soup with caramelized onions and melted cheese',
      userId: users[1].id, // Julia Child
      typeId: recipeTypes.find((t) => t.slug === 'soup')?.id,
      preparationTime: 30,
      cookingTime: 60,
      difficultyLevel: 'medium',
      servings: 4,
      status: 'published',
      searchVector: 'french onion soup cheese traditional',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '15-Minute Pasta',
      description: 'Quick and easy pasta dish perfect for busy weeknights',
      userId: users[2].id, // Jamie Oliver
      typeId: recipeTypes.find((t) => t.slug === 'main-course')?.id,
      preparationTime: 5,
      cookingTime: 15,
      difficultyLevel: 'easy',
      servings: 4,
      status: 'published',
      searchVector: 'pasta quick easy weeknight dinner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Chocolate Soufflé',
      description: 'Light and airy chocolate dessert',
      userId: users[1].id, // Julia Child
      typeId: recipeTypes.find((t) => t.slug === 'dessert')?.id,
      preparationTime: 20,
      cookingTime: 15,
      difficultyLevel: 'hard',
      servings: 2,
      status: 'published',
      searchVector: 'chocolate souffle dessert french',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Mediterranean Salad',
      description: 'Fresh and healthy salad with olives, feta, and tomatoes',
      userId: users[2].id, // Jamie Oliver
      typeId: recipeTypes.find((t) => t.slug === 'salad')?.id,
      preparationTime: 15,
      cookingTime: 0,
      difficultyLevel: 'easy',
      servings: 4,
      status: 'published',
      searchVector: 'mediterranean salad healthy fresh',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Breakfast Burrito',
      description: 'Hearty breakfast burrito with eggs, cheese, and vegetables',
      userId: users[0].id, // Gordon Ramsay
      typeId: recipeTypes.find((t) => t.slug === 'breakfast')?.id,
      preparationTime: 10,
      cookingTime: 15,
      difficultyLevel: 'medium',
      servings: 2,
      status: 'draft',
      searchVector: 'breakfast burrito eggs cheese mexican',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return sampleRecipes;
};

export const seedRecipes = async (
  db: LibSQLDatabase,
  users: User[],
  recipeTypes: RecipeType[],
) => {
  console.log('Inserting recipes...');
  const recipesToInsert = generateRecipes(users, recipeTypes);
  const insertedRecipes = await db
    .insert(recipes)
    .values(recipesToInsert)
    .returning();
  return insertedRecipes;
};
