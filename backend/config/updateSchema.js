import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const SQL_UPDATE = `
  -- Add is_admin column if it doesn't exist
  ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
  
  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
`;

async function updateSchema() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await client.connect();
    console.log('🔗 Updating database schema...');
    
    await client.query(SQL_UPDATE);
    console.log('✅ Database schema updated successfully!');
    
  } catch (error) {
    console.error('❌ Schema update error:', error.message);
  } finally {
    await client.end();
  }
}

updateSchema();