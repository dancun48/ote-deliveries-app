import pkg from 'pg';

const { Pool } = pkg;

// Use environment variable for production, fallback to individual vars for development
const getPoolConfig = () => {
  // If DATABASE_URL is provided (Render provides this), use it
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  // Fallback to individual environment variables for local development
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'otedb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
};

const pool = new Pool(getPoolConfig());

// Test connection
export const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Test query to verify connection
    const result = await client.query('SELECT NOW()');
    console.log('📊 Database time:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Don't crash, just return false
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down database connections...');
  await pool.end();
  process.exit(0);
});

export default pool;