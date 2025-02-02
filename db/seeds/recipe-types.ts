import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { recipeTypes } from '../schema/recipe/recipe-types';

const sampleRecipeTypes = [
  {
    name: 'Main Course',
    slug: 'main-course',
    description: 'Primary dishes that form the centerpiece of a meal',
  },
  {
    name: 'Appetizer',
    slug: 'appetizer',
    description: 'Small dishes served before the main course',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Dessert',
    slug: 'dessert',
    description: 'Sweet dishes served after the main course',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Breakfast',
    slug: 'breakfast',
    description: 'Morning meals to start the day',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Salad',
    slug: 'salad',
    description: 'Fresh and healthy dishes with vegetables or fruits',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Soup',
    slug: 'soup',
    description: 'Warm and comforting liquid-based dishes',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Snack',
    slug: 'snack',
    description: 'Small portions of food between meals',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const seedRecipeTypes = async (db: LibSQLDatabase) => {
  console.log('Inserting recipe types...');
  const insertedTypes = await db
    .insert(recipeTypes)
    .values(sampleRecipeTypes)
    .returning();
  return insertedTypes;
};
