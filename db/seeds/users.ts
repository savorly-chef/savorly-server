import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { users } from '../schema/user/users';

type User = typeof users.$inferInsert;

const sampleUsers: User[] = [
  {
    username: 'gordon_ramsay',
    email: 'gordon@example.com',
    password: 'hashed_password_1',
    profileImage: 'https://example.com/gordon.jpg',
    bio: 'Celebrity chef and restaurateur',
    role: 'user',
    rating: 4.8,
    premium: true,
    godmode: false,
    followers: 1000,
    following: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: 'julia_child',
    email: 'julia@example.com',
    password: 'hashed_password_2',
    profileImage: 'https://example.com/julia.jpg',
    bio: 'Bringing French cuisine to home cooking',
    role: 'user',
    rating: 4.9,
    premium: true,
    godmode: false,
    followers: 800,
    following: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: 'jamie_oliver',
    email: 'jamie@example.com',
    password: 'hashed_password_3',
    profileImage: 'https://example.com/jamie.jpg',
    bio: 'Making cooking fun and accessible',
    role: 'user',
    rating: 4.7,
    premium: false,
    godmode: false,
    followers: 600,
    following: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: 'admin_chef',
    email: 'admin@example.com',
    password: 'admin_password',
    profileImage: 'https://example.com/admin.jpg',
    bio: 'System administrator',
    role: 'admin',
    rating: 5.0,
    premium: true,
    godmode: true,
    followers: 100,
    following: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const seedUsers = async (db: LibSQLDatabase) => {
  console.log('Inserting users...');
  const insertedUsers = await db.insert(users).values(sampleUsers).returning();
  return insertedUsers;
};
