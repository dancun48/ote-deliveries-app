import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 12);
  
  console.log('Password:', password);
  console.log('Bcrypt hash:', hash);
  console.log('\nSQL to run in Render PostgreSQL:');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'user@test.com';`);
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@test.com';`);
}

generateHash();