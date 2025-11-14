import pool from "../config/database.js";

export const Delivery = {
  // Create new delivery
  async create(deliveryData) {
    const {
      trackingNumber,
      userId,
      pickupAddress,
      deliveryAddress,
      recipientName,
      recipientPhone,
      packageDescription,
      packageWeight,
    } = deliveryData;

    console.log("💾 Saving to database:", {
      trackingNumber,
      userId,
      recipientName,
      recipientPhone,
    });

    const query = `
      INSERT INTO deliveries 
      (tracking_number, user_id, pickup_address, delivery_address, recipient_name, recipient_phone, package_description, package_weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      trackingNumber,
      userId,
      pickupAddress,
      deliveryAddress,
      recipientName,
      recipientPhone,
      packageDescription,
      packageWeight,
    ];

    console.log("📝 Executing query with values:", values);
    const result = await pool.query(query, values);
    console.log("✅ Database insert successful:", result.rows[0].id);
    return result.rows[0];
  },

  // ... rest of the methods remain the same
  async findByTrackingNumber(trackingNumber) {
    const query = `
      SELECT d.*, u.first_name, u.last_name, dr.name as driver_name 
      FROM deliveries d 
      JOIN users u ON d.user_id = u.id 
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
      WHERE d.tracking_number = $1
    `;
    const result = await pool.query(query, [trackingNumber]);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT d.*, dr.name as driver_name 
      FROM deliveries d 
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
      WHERE d.user_id = $1 
      ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT d.*, u.first_name, u.last_name, u.email, dr.name as driver_name 
      FROM deliveries d 
      JOIN users u ON d.user_id = u.id 
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
      ORDER BY d.created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },
  
  async updateStatus(id, status, driverId = null) {
    const query = `
      UPDATE deliveries 
      SET status = $1, assigned_driver_id = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING *
  `;
    const result = await pool.query(query, [status, driverId, id]);
    return result.rows[0];
  },

  async count() {
    const result = await pool.query("SELECT COUNT(*) FROM deliveries");
    return parseInt(result.rows[0].count);
  },
};
