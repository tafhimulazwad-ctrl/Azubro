import { initDB } from './db.js';

async function setup() {
  const db = await initDB();
  console.log('Database initialized successfully!');
  
  // Verify tables exist
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables created:', tables.rows.map(row => row.name));
}

setup().catch(console.error);
