// controllers/driversController.js
import pool from '../config/database.js';

export const driversController = {
  // Get all drivers
  async getAllDrivers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const query = `
        SELECT id, name, email, phone, vehicle_type, license_plate, is_active, created_at 
        FROM drivers 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = 'SELECT COUNT(*) FROM drivers';
      
      const [driversResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        drivers: driversResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      });

    } catch (error) {
      console.error('❌ Get drivers error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching drivers' 
      });
    }
  },

  // Create new driver
  async createDriver(req, res) {
    try {
      const { name, email, phone, vehicle_type, license_plate } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !vehicle_type || !license_plate) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: name, email, phone, vehicle_type, license_plate'
        });
      }

      // Check if driver with email already exists
      const existingDriver = await pool.query(
        'SELECT id FROM drivers WHERE email = $1',
        [email]
      );

      if (existingDriver.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Driver with this email already exists'
        });
      }

      // Check if license plate already exists
      const existingLicense = await pool.query(
        'SELECT id FROM drivers WHERE license_plate = $1',
        [license_plate]
      );

      if (existingLicense.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Driver with this license plate already exists'
        });
      }

      // Insert new driver
      const insertQuery = `
        INSERT INTO drivers (name, email, phone, vehicle_type, license_plate, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, phone, vehicle_type, license_plate, is_active, created_at
      `;

      const values = [name, email, phone, vehicle_type, license_plate, true];
      
      const result = await pool.query(insertQuery, values);
      const newDriver = result.rows[0];

      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        driver: newDriver
      });

    } catch (error) {
      console.error('❌ Create driver error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while creating driver' 
      });
    }
  },

  // Update driver status (activate/deactivate)
  async updateDriverStatus(req, res) {
    try {
      const { driverId } = req.params;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'is_active must be a boolean value'
        });
      }

      const query = `
        UPDATE drivers 
        SET is_active = $1 
        WHERE id = $2 
        RETURNING id, name, email, is_active
      `;
      
      const result = await pool.query(query, [is_active, driverId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      const updatedDriver = result.rows[0];

      res.json({
        success: true,
        message: `Driver ${is_active ? 'activated' : 'deactivated'} successfully`,
        driver: updatedDriver
      });

    } catch (error) {
      console.error('❌ Update driver status error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while updating driver status' 
      });
    }
  },

  // Update driver details
  async updateDriver(req, res) {
    try {
      const { driverId } = req.params;
      const { name, email, phone, vehicle_type, license_plate } = req.body;

      // Check if driver exists
      const driverCheck = await pool.query(
        'SELECT id FROM drivers WHERE id = $1',
        [driverId]
      );

      if (driverCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      // Check if email is taken by another driver
      if (email) {
        const emailCheck = await pool.query(
          'SELECT id FROM drivers WHERE email = $1 AND id != $2',
          [email, driverId]
        );

        if (emailCheck.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email is already taken by another driver'
          });
        }
      }

      // Check if license plate is taken by another driver
      if (license_plate) {
        const licenseCheck = await pool.query(
          'SELECT id FROM drivers WHERE license_plate = $1 AND id != $2',
          [license_plate, driverId]
        );

        if (licenseCheck.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'License plate is already taken by another driver'
          });
        }
      }

      // Build dynamic update query based on provided fields
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (name) {
        updateFields.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }

      if (email) {
        updateFields.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }

      if (phone) {
        updateFields.push(`phone = $${paramCount}`);
        values.push(phone);
        paramCount++;
      }

      if (vehicle_type) {
        updateFields.push(`vehicle_type = $${paramCount}`);
        values.push(vehicle_type);
        paramCount++;
      }

      if (license_plate) {
        updateFields.push(`license_plate = $${paramCount}`);
        values.push(license_plate);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      values.push(driverId);

      const query = `
        UPDATE drivers 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING id, name, email, phone, vehicle_type, license_plate, is_active, created_at
      `;

      const result = await pool.query(query, values);
      const updatedDriver = result.rows[0];

      res.json({
        success: true,
        message: 'Driver updated successfully',
        driver: updatedDriver
      });

    } catch (error) {
      console.error('❌ Update driver error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while updating driver' 
      });
    }
  },

  // Get driver by ID
  async getDriverById(req, res) {
    try {
      const { driverId } = req.params;

      console.log('🔍 Getting driver by ID:', driverId);

      const query = `
        SELECT id, name, email, phone, vehicle_type, license_plate, is_active, created_at 
        FROM drivers 
        WHERE id = $1
      `;

      const result = await pool.query(query, [driverId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      const driver = result.rows[0];

      res.json({
        success: true,
        driver
      });

    } catch (error) {
      console.error('❌ Get driver by ID error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching driver' 
      });
    }
  }
};