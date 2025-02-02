import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { settings } from '../schema/user/settings';
import { users } from '../schema/user/users';

type User = typeof users.$inferSelect;
type Setting = typeof settings.$inferInsert;

const generateSettings = (users: User[]) => {
  return users.map(
    (user): Setting => ({
      userId: user.id,
      language: 'en',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );
};

export const seedSettings = async (db: LibSQLDatabase, users: User[]) => {
  console.log('Inserting user settings...');
  const settingsToInsert = generateSettings(users);
  const insertedSettings = await db
    .insert(settings)
    .values(settingsToInsert)
    .returning();
  return insertedSettings;
};
