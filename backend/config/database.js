import pkg from 'pg';

const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'otedb',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    };

const pool = new Pool(poolConfig);

// Fixed testConnection function
export const testConnection = async () => {
  let client;  // Declare client at function scope
  
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Optional: Run a test query
    const result = await client.query('SELECT NOW()');
    console.log('📊 Database time:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  } finally {
    // Now client is in scope
    if (client) {
      client.release();
      console.log('🔗 Database client released');
    }
  }
};

export default pool;