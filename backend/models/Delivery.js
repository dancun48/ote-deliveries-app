import pool from "../config/database.js";

export const Delivery = {
  // Create new delivery - UPDATED
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
      numberOfBoxes = 1,
      zone = null,
      basePrice = 0,
      additionalBoxPrice = 0,
      totalPrice = 0,
    } = deliveryData;

    console.log("💾 Saving to database with pricing data:", {
      trackingNumber,
      userId,
      numberOfBoxes,
      zone,
      totalPrice,
    });

    const query = `
      INSERT INTO deliveries 
      (tracking_number, user_id, pickup_address, delivery_address, 
       recipient_name, recipient_phone, package_description, package_weight,
       number_of_boxes, zone, base_price, additional_box_price, total_price,
       price_breakdown)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const priceBreakdown = {
      numberOfBoxes,
      zone,
      basePrice,
      additionalBoxPrice,
      totalPrice,
      perBoxPrice: additionalBoxPrice > 0 ? additionalBoxPrice / (numberOfBoxes - 2) : 0,
      calculatedAt: new Date().toISOString()
    };

    const values = [
      trackingNumber,
      userId,
      pickupAddress,
      deliveryAddress,
      recipientName,
      recipientPhone,
      packageDescription,
      packageWeight,
      numberOfBoxes,
      zone,
      basePrice,
      additionalBoxPrice,
      totalPrice,
      JSON.stringify(priceBreakdown),
    ];

    console.log("📝 Executing query with values:", values);
    const result = await pool.query(query, values);
    console.log("✅ Database insert successful with pricing:", result.rows[0].id);
    return result.rows[0];
  },

  // Find by tracking number - UPDATED
  async findByTrackingNumber(trackingNumber) {
    const query = `
      SELECT d.*, 
             u.first_name, u.last_name, u.email,
             dr.name as driver_name 
      FROM deliveries d 
      JOIN users u ON d.user_id = u.id 
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
      WHERE d.tracking_number = $1
    `;
    const result = await pool.query(query, [trackingNumber]);
    return result.rows[0];
  },

  // Find by user ID - UPDATED
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

  // Find all deliveries - UPDATED
  async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT d.*, 
             u.first_name, u.last_name, u.email,
             dr.name as driver_name 
      FROM deliveries d 
      JOIN users u ON d.user_id = u.id 
      LEFT JOIN drivers dr ON d.assigned_driver_id = dr.id 
      ORDER BY d.created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },
  
  // Count deliveries
  async count() {
    const result = await pool.query("SELECT COUNT(*) FROM deliveries");
    return parseInt(result.rows[0].count);
  },
  
  // Update status (unchanged)
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

  // NEW: Get delivery revenue statistics
  async getRevenueStats() {
    const query = `
      SELECT 
        COUNT(*) as total_deliveries,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COALESCE(AVG(total_price), 0) as average_order_value,
        COALESCE(SUM(number_of_boxes), 0) as total_boxes,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_price ELSE 0 END), 0) as delivered_revenue,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) as completed_deliveries
      FROM deliveries
    `;
    const result = await pool.query(query);
    return result.rows[0];
  },

  // NEW: Get zone-wise statistics
  async getZoneStats() {
    const query = `
      SELECT 
        zone,
        COUNT(*) as deliveries_count,
        COALESCE(SUM(total_price), 0) as zone_revenue,
        COALESCE(SUM(number_of_boxes), 0) as total_boxes,
        COALESCE(AVG(total_price), 0) as avg_order_value
      FROM deliveries
      WHERE zone IS NOT NULL
      GROUP BY zone
      ORDER BY zone_revenue DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },
};