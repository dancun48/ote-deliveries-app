import pool from '../config/database.js';

export const User = {
  // Create new user
  async create(userData) {
    const { email, password, firstName, lastName, phone, userType, companyName, isAdmin = false } = userData;
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, user_type, company_name, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, user_type, is_admin, created_at
    `;
    
    const values = [email, password, firstName, lastName, phone, userType, companyName, isAdmin];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, user_type, phone, company_name, is_admin, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Find all admin users
  async findAdmins() {
    const query = 'SELECT id, email, first_name, last_name, created_at FROM users WHERE is_admin = true';
    const result = await pool.query(query);
    return result.rows;
  },
  // update user profile
  async update(id, updateData) {
    const { firstName, lastName, email, phone, userType, companyName } = updateData;
    
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, phone = $4, 
          user_type = $5, company_name = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, email, first_name, last_name, phone, user_type, company_name, is_admin, created_at
    `;
    
    const values = [firstName, lastName, email, phone, userType, companyName, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};