import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { recipeImages } from '../schema/recipe/recipe-images';
import { recipes } from '../schema/recipe/recipes';

type Recipe = typeof recipes.$inferSelect;
type RecipeImage = typeof recipeImages.$inferInsert;

const generateRecipeImages = (recipes: Recipe[]): RecipeImage[] => {
  const images: RecipeImage[] = [];

  // Generate 1-3 images for each recipe
  for (const recipe of recipes) {
    const numImages = Math.floor(Math.random() * 3) + 1;

    for (let i = 1; i <= numImages; i++) {
      images.push({
        recipeId: recipe.id,
        url: `https://example.com/recipes/${recipe.id}/image${i}.jpg`,
        storageKey: `recipes/${recipe.id}/image${i}.jpg`,
        altText: `${recipe.title} - Image ${i}`,
        width: 1200,
        height: 800,
        size: 500000, // 500KB
        mimeType: 'image/jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return images;
};

export const seedRecipeImages = async (
  db: LibSQLDatabase,
  recipes: Recipe[],
) => {
  console.log('Inserting recipe images...');
  const imagesToInsert = generateRecipeImages(recipes);
  const insertedImages = await db
    .insert(recipeImages)
    .values(imagesToInsert)
    .returning();
  return insertedImages;
};
