import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { aiFeatures } from '../schema/ai/ai-features';

type AiFeature = typeof aiFeatures.$inferInsert;

const sampleFeatures: AiFeature[] = [
  {
    name: 'Recipe Generation',
    description: 'Generate new recipes based on ingredients or cuisine type',
    isPremium: false,
    promptTemplate:
      'Generate a recipe for {cuisine} cuisine using {ingredients}',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Recipe Modification',
    isPremium: false,
    description:
      'Modify existing recipes for dietary restrictions or preferences',
    promptTemplate: 'Modify this recipe to be {dietary_restriction} friendly',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Cooking Tips',
    isPremium: false,
    description: 'Get real-time cooking tips and technique suggestions',
    promptTemplate: 'Provide cooking tips for {technique}',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const seedAiFeatures = async (db: LibSQLDatabase) => {
  console.log('Inserting AI features...');
  const insertedFeatures = await db
    .insert(aiFeatures)
    .values(sampleFeatures)
    .returning();
  return insertedFeatures;
};
