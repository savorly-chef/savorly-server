import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { aiMessages } from '../schema/ai/ai-messages';
import { aiConversations } from '../schema/ai/ai-conversations';

type AiConversation = typeof aiConversations.$inferSelect;
type AiMessage = typeof aiMessages.$inferInsert;

const generateMessages = (conversations: AiConversation[]) => {
  const messages: AiMessage[] = [];

  // Generate 2-4 messages for each conversation
  for (const conversation of conversations) {
    const numMessages = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numMessages; i++) {
      const isUser = i % 2 === 0;
      messages.push({
        conversationId: conversation.id,
        isUser,
        content: isUser
          ? 'Can you help me with a recipe?'
          : "Of course! I'd be happy to help you with a recipe. What type of dish are you interested in making?",
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return messages;
};

export const seedAiMessages = async (
  db: LibSQLDatabase,
  conversations: AiConversation[],
) => {
  console.log('Inserting AI messages...');
  const messagesToInsert = generateMessages(conversations);
  const insertedMessages = await db
    .insert(aiMessages)
    .values(messagesToInsert)
    .returning();
  return insertedMessages;
};
