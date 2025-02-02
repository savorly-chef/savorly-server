import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { aiConversations } from '../schema/ai/ai-conversations';
import { users } from '../schema/user/users';
import { aiFeatures } from '../schema/ai/ai-features';

type User = typeof users.$inferSelect;
type AiFeature = typeof aiFeatures.$inferSelect;
type AiConversation = typeof aiConversations.$inferInsert;

const generateConversations = (users: User[], features: AiFeature[]) => {
  const conversations: AiConversation[] = [];

  // Generate 1-2 conversations for each user
  for (const user of users) {
    const numConversations = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numConversations; i++) {
      const feature = features[Math.floor(Math.random() * features.length)];
      conversations.push({
        userId: user.id,
        featureId: feature.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return conversations;
};

export const seedAiConversations = async (
  db: LibSQLDatabase,
  users: User[],
  features: AiFeature[],
) => {
  console.log('Inserting AI conversations...');
  const conversationsToInsert = generateConversations(users, features);
  const insertedConversations = await db
    .insert(aiConversations)
    .values(conversationsToInsert)
    .returning();
  return insertedConversations;
};
