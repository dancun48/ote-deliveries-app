// initAdmin.js
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function initAdmin() {
  console.log('🚀 Initializing admin user...\n');
  
  try {
    // Add admin column
    console.log('1️⃣ Adding is_admin column...');
    await execAsync(`
      psql -U apple -d otedb -c "
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
      SELECT 'Column added successfully' as message;"
    `);
    
    // Seed admin
    console.log('\n2️⃣ Seeding admin users...');
    const { stdout } = await execAsync('node config/seedAdmin.js');
    console.log(stdout);
    
    console.log('\n✅ Admin initialization complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

initAdmin();