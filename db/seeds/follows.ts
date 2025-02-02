import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { follows } from '../schema/user/follows';
import { users } from '../schema/user/users';

type User = typeof users.$inferSelect;
type Follow = typeof follows.$inferInsert;

const generateFollows = (users: User[]) => {
  const followRelations: Follow[] = [];

  // Each user follows some other users
  for (const user of users) {
    // Each user follows 1-2 random other users
    const otherUsers = users.filter((u) => u.id !== user.id);
    const numFollows = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numFollows && i < otherUsers.length; i++) {
      followRelations.push({
        followingUserId: user.id,
        followedUserId: otherUsers[i].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return followRelations;
};

export const seedFollows = async (db: LibSQLDatabase, users: User[]) => {
  console.log('Inserting user follows...');
  const followsToInsert = generateFollows(users);
  const insertedFollows = await db
    .insert(follows)
    .values(followsToInsert)
    .returning();
  return insertedFollows;
};
