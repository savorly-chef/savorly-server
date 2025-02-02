import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db } from './db';

const { log, error } = console;

const purgeDatabase = async () => {
  log('🗑️  Purging database...');

  try {
    // Get all tables
    const result = await db
      .select({ name: sql<string>`name` })
      .from(sql.raw('sqlite_master'))
      .where(sql.raw("type='table' AND name NOT LIKE 'sqlite_%'"));

    // Drop all tables
    await db.run(sql`PRAGMA foreign_keys=off;`);

    for (const row of result) {
      await db.run(sql.raw(`DROP TABLE IF EXISTS "${row.name}";`));
    }

    // Clean up SQLite internals
    await db.run(sql`
      DELETE FROM sqlite_sequence;
      VACUUM;
      PRAGMA foreign_keys=on;
    `);

    log('✅ Database purged successfully!');
  } catch (err) {
    if (err instanceof Error) {
      error('❌ Error purging database:', err.message);
    } else {
      error('❌ Unknown error purging database');
    }
    process.exit(1);
  }

  process.exit(0);
};

purgeDatabase();
