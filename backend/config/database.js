import pkg from "pg";

const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "otedb",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
    };

const pool = new Pool(poolConfig);

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

export default pool;
