import pool from '../config/database.js';

export const adminController = {
  // -------Get all users------
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const query = `
        SELECT id, email, first_name, last_name, phone, user_type, company_name, is_admin, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = 'SELECT COUNT(*) FROM users';
      
      const [usersResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        users: usersResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      });

    } catch (error) {
      console.error('❌ Get users error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching users' 
      });
    }
  },

  // -----Get dashboard stats-----
  async getDashboardStats(req, res) {
    try {
      const [
        totalDeliveriesResult,
        pendingDeliveriesResult,
        totalUsersResult,
        todayDeliveriesResult
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM deliveries'),
        pool.query('SELECT COUNT(*) FROM deliveries WHERE status = $1', ['pending']),
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM deliveries WHERE DATE(created_at) = CURRENT_DATE')
      ]);

      const stats = {
        totalDeliveries: parseInt(totalDeliveriesResult.rows[0].count),
        pendingDeliveries: parseInt(pendingDeliveriesResult.rows[0].count),
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        todayDeliveries: parseInt(todayDeliveriesResult.rows[0].count)
      };

      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('❌ Get stats error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching stats' 
      });
    }
  },

  // -----Get all deliveries for admin------
  async getAllDeliveries(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          d.*, 
          u.first_name, 
          u.last_name, 
          u.email,
          dr.name as driver_name
        FROM deliveries d 
        JOIN users u ON d.user_id = u.id 
        LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
        ORDER BY d.created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = 'SELECT COUNT(*) FROM deliveries';
      
      const [deliveriesResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        deliveries: deliveriesResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      });

    } catch (error) {
      console.error('❌ Get all deliveries error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching deliveries' 
      });
    }
  },

  // ----Update delivery status------
  async updateDeliveryStatus(req, res) {
    try {
      const { deliveryId } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      const query = `
        UPDATE deliveries 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `;
      
      const result = await pool.query(query, [status, deliveryId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      const delivery = result.rows[0];

      // Emit real-time update
      if (req.io) {
        req.io.to('admins').emit('delivery_status_updated', delivery);
      }

      res.json({
        success: true,
        message: 'Delivery status updated successfully',
        delivery
      });

    } catch (error) {
      console.error('❌ Update delivery status error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while updating delivery status' 
      });
    }
  },
  async createUser(req, res) {
  try {
    const { email, password, firstName, lastName, phone, userType, companyName } = req.body;

    console.log('👤 Admin creating user:', email);

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 12);

    // Create user
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, user_type, company_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, phone, user_type, company_name, is_admin, created_at
    `;

    const values = [email, hashedPassword, firstName, lastName, phone, userType, companyName];
    const result = await pool.query(query, values);

    const newUser = result.rows[0];

    console.log('✅ User created successfully by admin:', newUser.email);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error('❌ Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user'
    });
  }
},

// -----Update user------
async updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, userType, companyName } = req.body;

    console.log('📝 Admin updating user:', { userId, email });

    // Check if email is taken by another user
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Update user
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, phone = $4, 
          user_type = $5, company_name = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, email, first_name, last_name, phone, user_type, company_name, is_admin, created_at
    `;

    const values = [firstName, lastName, email, phone, userType, companyName, userId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = result.rows[0];

    console.log('✅ User updated successfully by admin:', updatedUser.email);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
},

// -----Delete user------
async deleteUser(req, res) {
  try {
    const { userId } = req.params;

    console.log('🗑️ Admin deleting user:', userId);

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user (you might want to soft delete instead)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    console.log('✅ User deleted successfully by admin');

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
},

// -----Assign driver to delivery------
async assignDriverToDelivery(req, res) {
  try {
    const { deliveryId } = req.params;
    const { driver_id } = req.body;

    console.log('🚗 Assigning driver to delivery:', { deliveryId, driver_id });

    // Validate input
    if (!driver_id) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    // Validate UUID format for both IDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(deliveryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID format. Must be a valid UUID.'
      });
    }

    if (!uuidRegex.test(driver_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID format. Must be a valid UUID.'
      });
    }

    // Check if delivery exists
    const deliveryCheck = await pool.query('SELECT id, status FROM deliveries WHERE id = $1', [deliveryId]);
    if (deliveryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    const delivery = deliveryCheck.rows[0];
    
    // Check if delivery can be assigned (e.g., is in pending status)
    if (delivery.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot assign driver to delivery with status: ${delivery.status}. Delivery must be in 'pending' status.`
      });
    }

    // Check if driver exists and is available
    const driverCheck = await pool.query('SELECT id, name, is_available FROM drivers WHERE id = $1', [driver_id]);
    if (driverCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    const driver = driverCheck.rows[0];
    if (!driver.is_available) {
      return res.status(400).json({
        success: false,
        message: 'Driver is not available for assignment'
      });
    }

    // Update delivery with assigned driver
    const query = `
      UPDATE deliveries 
      SET assigned_driver_id = $1, status = 'assigned', updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [driver_id, deliveryId]);
    const updatedDelivery = result.rows[0];

    console.log('✅ Driver assigned successfully to delivery:', deliveryId);

    // Emit real-time update
    if (req.io) {
      req.io.to('admins').emit('driver_assigned', updatedDelivery);
    }

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      data: {
        delivery: updatedDelivery
      }
    });

  } catch (error) {
    console.error('❌ Assign driver error:', error);
    
    // Handle UUID format errors specifically
    if (error.code === '22P02') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format. Please check the delivery and driver IDs are valid UUIDs.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while assigning driver'
    });
  }
},
// -----Get available drivers------
async getAvailableDrivers(req, res) {
  try {
    console.log('🔍 Fetching available drivers...');

    // Query to get drivers who are available and not assigned to active deliveries
    const query = `
      SELECT d.* 
      FROM drivers d
      WHERE d.is_available = true 
        AND d.id NOT IN (
          SELECT assigned_driver_id 
          FROM deliveries 
          WHERE status IN ('assigned', 'picked_up', 'in_transit')
          AND assigned_driver_id IS NOT NULL
        )
      ORDER BY d.name
    `;

    const result = await pool.query(query);
    
    console.log(`✅ Found ${result.rows.length} available drivers`);

    res.json({
      success: true,
      drivers: result.rows
    });

  } catch (error) {
    console.error('❌ Get available drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available drivers'
    });
  }
},

// -----Get user deliveries------
async getUserDeliveries(req, res) {
  try {
    const { userId } = req.params;
    const query = `
      SELECT 
        d.*,
        dr.name as driver_name,
        dr.phone as driver_phone
      FROM deliveries d
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    res.json({
      success: true,
      deliveries: result.rows
    });

  } catch (error) {
    console.error('❌ Get user deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user deliveries'
    });
  }
}
};