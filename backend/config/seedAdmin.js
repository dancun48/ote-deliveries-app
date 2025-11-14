import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const adminUsers = [
  {
    email: 'admin@delivery.com',
    password: 'admin123',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+254700000000',
    userType: 'personal',
    isAdmin: true
  },
  {
    email: 'manager@delivery.com',
    password: 'manager123',
    firstName: 'Delivery',
    lastName: 'Manager',
    phone: '+254711111111',
    userType: 'personal',
    isAdmin: true
  },
  {
    email: 'operations@delivery.com',
    password: 'ops123',
    firstName: 'Operations',
    lastName: 'Manager',
    phone: '+254722222222',
    userType: 'personal',
    isAdmin: true
  }
];

async function seedAdminUsers() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await client.connect();

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const checkQuery = 'SELECT id FROM users WHERE email = $1';
      const checkResult = await client.query(checkQuery, [adminData.email]);

      if (checkResult.rows.length === 0) {
        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 12);
        
        // Insert admin user
        const insertQuery = `
          INSERT INTO users (email, password, first_name, last_name, phone, user_type, is_admin) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING id, email, first_name, last_name
        `;
        
        const values = [
          adminData.email,
          hashedPassword,
          adminData.firstName,
          adminData.lastName,
          adminData.phone,
          adminData.userType,
          true
        ];

        const result = await client.query(insertQuery, values);
        console.log(`✅ Created admin user: ${adminData.email}`);
      } else {
        console.log(`⚠️ Admin user already exists: ${adminData.email}`);
      }
    }
    
    // Display admin credentials
    adminUsers.forEach(admin => {
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${admin.password}`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await client.end();
  }
}

seedAdminUsers();