import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const SQL_SETUP = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) DEFAULT 'personal' CHECK (user_type IN ('personal', 'corporate')),
    company_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT false,  -- NEW COLUMN
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(100),
    license_plate VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries table (UPDATED with pricing columns)
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    package_description TEXT,
    package_weight DECIMAL(8,2),
    
    -- NEW: Pricing and boxes columns
    number_of_boxes INTEGER DEFAULT 1,
    zone VARCHAR(20),
    base_price DECIMAL(10,2) DEFAULT 0,
    additional_box_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0,
    price_breakdown JSONB,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    assigned_driver_id UUID REFERENCES drivers(id),
    pickup_date TIMESTAMPTZ,
    delivery_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance (UPDATED with new indexes)
CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_number ON deliveries(tracking_number);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_zone ON deliveries(zone);
CREATE INDEX IF NOT EXISTS idx_deliveries_total_price ON deliveries(total_price);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample driver (only if not exists)
INSERT INTO drivers (name, email, phone, vehicle_type, license_plate) 
VALUES ('John Driver', 'driver@example.com', '+254712345678', 'Motorcycle', 'KAA123A')
ON CONFLICT (email) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if they don't exist)
DO $$ 
BEGIN
    -- Check and create trigger for users table
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Check and create trigger for deliveries table
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_deliveries_updated_at') THEN
        CREATE TRIGGER update_deliveries_updated_at 
        BEFORE UPDATE ON deliveries 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
`;

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME // Connect directly to the target database
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database:', process.env.DB_NAME);

    // Split and execute SQL commands
    const commands = SQL_SETUP.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await client.query(command);
          console.log('✅ Executed SQL command successfully');
        } catch (error) {
          // Ignore "already exists" errors, show others
          if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
            console.log('⚠️  SQL command warning:', error.message);
          }
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Tables created: users, drivers, deliveries');
    console.log('🚗 Sample driver inserted');
    console.log('⚡ Indexes and triggers configured');

    // Verify tables were created
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('📋 Available tables:', tablesCheck.rows.map(row => row.table_name).join(', '));

    await client.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    
    // More specific error messages
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Solution: Create the database first:');
      console.log('  1. Run: createdb otedb');
      console.log('  2. Then run: npm run db:setup again');
    } else if (error.message.includes('connection refused')) {
      console.log('\n💡 Solution: Make sure PostgreSQL is running');
      console.log('  On macOS: brew services start postgresql');
      console.log('  On Linux: sudo service postgresql start');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Solution: Check your database password in .env file');
    }
    
    process.exit(1);
  }
}

setupDatabase();