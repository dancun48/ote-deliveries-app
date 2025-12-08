import pool from "../config/database.js";

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

      const countQuery = "SELECT COUNT(*) FROM users";

      const [usersResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery),
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
          totalPages,
        },
      });
    } catch (error) {
      console.error("❌ Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching users",
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
        todayDeliveriesResult,
      ] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM deliveries"),
        pool.query("SELECT COUNT(*) FROM deliveries WHERE status = $1", [
          "pending",
        ]),
        pool.query("SELECT COUNT(*) FROM users"),
        pool.query(
          "SELECT COUNT(*) FROM deliveries WHERE DATE(created_at) = CURRENT_DATE"
        ),
      ]);

      const stats = {
        totalDeliveries: parseInt(totalDeliveriesResult.rows[0].count),
        pendingDeliveries: parseInt(pendingDeliveriesResult.rows[0].count),
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        todayDeliveries: parseInt(todayDeliveriesResult.rows[0].count),
      };

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("❌ Get stats error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching stats",
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

      const countQuery = "SELECT COUNT(*) FROM deliveries";

      const [deliveriesResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery),
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
          totalPages,
        },
      });
    } catch (error) {
      console.error("❌ Get all deliveries error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching deliveries",
      });
    }
  },

  // ----Update delivery status------
  async updateDeliveryStatus(req, res) {
    try {
      const { deliveryId } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Must be one of: " + validStatuses.join(", "),
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
          message: "Delivery not found",
        });
      }

      const delivery = result.rows[0];

      // Emit real-time update
      if (req.io) {
        req.io.to("admins").emit("delivery_status_updated", delivery);
      }

      res.json({
        success: true,
        message: "Delivery status updated successfully",
        delivery,
      });
    } catch (error) {
      console.error("❌ Update delivery status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating delivery status",
      });
    }
  },
  async createUser(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        userType,
        companyName,
      } = req.body;

      console.log("👤 Admin creating user:", email);

      // Check if user exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Hash password
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.default.hash(password, 12);

      // Create user
      const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, user_type, company_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, phone, user_type, company_name, is_admin, created_at
    `;

      const values = [
        email,
        hashedPassword,
        firstName,
        lastName,
        phone,
        userType,
        companyName,
      ];
      const result = await pool.query(query, values);

      const newUser = result.rows[0];

      console.log("✅ User created successfully by admin:", newUser.email);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      console.error("❌ Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating user",
      });
    }
  },

  // -----Update user------
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, phone, userType, companyName } =
        req.body;

      console.log("📝 Admin updating user:", { userId, email });

      // Check if email is taken by another user
      if (email) {
        const emailCheck = await pool.query(
          "SELECT id FROM users WHERE email = $1 AND id != $2",
          [email, userId]
        );

        if (emailCheck.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken by another user",
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

      const values = [
        firstName,
        lastName,
        email,
        phone,
        userType,
        companyName,
        userId,
      ];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = result.rows[0];

      console.log("✅ User updated successfully by admin:", updatedUser.email);

      res.json({
        success: true,
        message: "User updated successfully",
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("❌ Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating user",
      });
    }
  },

  // -----Delete user------
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      console.log("🗑️ Admin deleting user:", userId);

      // Check if user exists
      const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
        userId,
      ]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete user (you might want to soft delete instead)
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);

      console.log("✅ User deleted successfully by admin");

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("❌ Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting user",
      });
    }
  },

  // -----Assign driver to delivery------
  async assignDriverToDelivery(req, res) {
    try {
      const { deliveryId } = req.params;
      const { driver_id } = req.body;

      console.log("🚗 Assigning driver to delivery:", {
        deliveryId,
        driver_id,
      });

      // Validate input
      if (!driver_id) {
        return res.status(400).json({
          success: false,
          message: "Driver ID is required",
        });
      }

      // REMOVE UUID VALIDATION - Accept both integers and UUIDs
      // Convert to numbers if they're numeric strings
      const deliveryIdNum = isNaN(deliveryId)
        ? deliveryId
        : parseInt(deliveryId);
      const driverIdNum = isNaN(driver_id) ? driver_id : parseInt(driver_id);

      console.log("📊 Parsed IDs:", { deliveryIdNum, driverIdNum });

      // Start a transaction for multiple operations
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Check if delivery exists and is in pending status
        const deliveryCheck = await client.query(
          "SELECT id, status FROM deliveries WHERE id = $1 FOR UPDATE",
          [deliveryIdNum]
        );

        if (deliveryCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            message: "Delivery not found",
          });
        }

        const delivery = deliveryCheck.rows[0];

        if (delivery.status !== "pending" && delivery.status !== "assigned") {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: `Cannot assign driver to delivery with status: ${delivery.status}. Delivery must be in 'pending' or 'assigned' status.`,
          });
        }

        // Check if driver exists and is active
        const driverCheck = await client.query(
          "SELECT id, name, is_active FROM drivers WHERE id = $1 FOR UPDATE",
          [driverIdNum]
        );

        if (driverCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            message: "Driver not found",
          });
        }

        const driver = driverCheck.rows[0];
        if (!driver.is_active) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: "Driver is not active and cannot be assigned",
          });
        }

        // Check if driver is already assigned to another active delivery
        const activeAssignmentCheck = await client.query(
          `SELECT id, tracking_number FROM deliveries 
         WHERE assigned_driver_id = $1 
         AND status IN ('assigned', 'picked_up', 'in_transit')
         AND id != $2`,
          [driverIdNum, deliveryIdNum]
        );

        if (activeAssignmentCheck.rows.length > 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: `Driver is already assigned to delivery ${activeAssignmentCheck.rows[0].tracking_number}`,
          });
        }

        // Update delivery with assigned driver
        const updateDeliveryQuery = `
        UPDATE deliveries 
        SET assigned_driver_id = $1, 
            status = CASE 
              WHEN status = 'pending' THEN 'assigned'
              ELSE status 
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;

        const result = await client.query(updateDeliveryQuery, [
          driverIdNum,
          deliveryIdNum,
        ]);
        const updatedDelivery = result.rows[0];

        console.log("✅ Driver assigned successfully:", {
          deliveryId: updatedDelivery.id,
          driverId: driverIdNum,
          newStatus: updatedDelivery.status,
        });

        // Create tracking update
        await client.query(
          `INSERT INTO delivery_updates (delivery_id, status, notes)
         VALUES ($1, $2, $3)`,
          [
            deliveryIdNum,
            "driver_assigned",
            `Driver ${driver.name} assigned to delivery`,
          ]
        );

        // Emit real-time update
        try {
          if (req.io || global.io) {
            const io = req.io || global.io;
            io.to("admins").emit("driver_assigned", {
              deliveryId: updatedDelivery.id,
              trackingNumber: updatedDelivery.tracking_number,
              driverId: driverIdNum,
              driverName: driver.name,
              status: updatedDelivery.status,
              timestamp: new Date().toISOString(),
            });

            // Emit to specific driver room if you have one
            io.to(`driver_${driverIdNum}`).emit("new_assignment", {
              deliveryId: updatedDelivery.id,
              trackingNumber: updatedDelivery.tracking_number,
              pickupAddress: updatedDelivery.pickup_address,
              deliveryAddress: updatedDelivery.delivery_address,
              recipientName: updatedDelivery.recipient_name,
            });
          }
        } catch (websocketError) {
          console.log("⚠️ WebSocket emit failed:", websocketError.message);
          // Don't fail the whole request if WebSocket fails
        }

        await client.query("COMMIT");

        res.json({
          success: true,
          message: `Driver ${driver.name} assigned successfully`,
          data: {
            delivery: updatedDelivery,
            driver: {
              id: driver.id,
              name: driver.name,
            },
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Transaction error:", error);
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("❌ Assign driver error:", error);

      // Handle specific PostgreSQL errors
      if (error.code === "22P02") {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format. IDs must be valid numbers or UUIDs.",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while assigning driver",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // -----Update delivery status with driver availability logic------
  async updateDeliveryStatus(req, res) {
    try {
      const { deliveryId } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Must be one of: " + validStatuses.join(", "),
        });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Get current delivery details including assigned driver
        const currentDelivery = await client.query(
          "SELECT id, status, assigned_driver_id FROM deliveries WHERE id = $1 FOR UPDATE",
          [deliveryId]
        );

        if (currentDelivery.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            message: "Delivery not found",
          });
        }

        const delivery = currentDelivery.rows[0];
        const previousDriverId = delivery.assigned_driver_id;

        // Update delivery status
        const updateQuery = `
        UPDATE deliveries 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `;

        const result = await client.query(updateQuery, [status, deliveryId]);
        const updatedDelivery = result.rows[0];

        // Handle driver availability based on status changes
        if (previousDriverId) {
          if (status === "delivered" || status === "cancelled") {
            // Driver becomes available when delivery is completed or cancelled
            await client.query(
              "UPDATE drivers SET is_active = true WHERE id = $1",
              [previousDriverId]
            );
            console.log(
              `✅ Driver ${previousDriverId} set to available (delivery ${status})`
            );
          } else if (
            status === "in_transit" &&
            delivery.status !== "in_transit"
          ) {
            // Driver becomes unavailable when delivery goes in transit
            await client.query(
              "UPDATE drivers SET is_active = false WHERE id = $1",
              [previousDriverId]
            );
            console.log(
              `✅ Driver ${previousDriverId} set to unavailable (delivery in transit)`
            );
          }
        }

        await client.query("COMMIT");

        // Emit real-time update
        if (req.io) {
          req.io.to("admins").emit("delivery_status_updated", updatedDelivery);
          if (previousDriverId) {
            req.io
              .to(`driver_${previousDriverId}`)
              .emit("assignment_updated", updatedDelivery);
          }
        }

        res.json({
          success: true,
          message: "Delivery status updated successfully",
          data: {
            delivery: updatedDelivery,
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("❌ Update delivery status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating delivery status",
      });
    }
  },
  // -----Get available drivers------
  async getAvailableDrivers(req, res) {
    try {
      console.log("🔍 Fetching available drivers...");

      // Query to get drivers who are available and not assigned to active deliveries
      const query = `
      SELECT d.* 
      FROM drivers d
      WHERE d.is_active = true 
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
        drivers: result.rows,
      });
    } catch (error) {
      console.error("❌ Get available drivers error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching available drivers",
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
        deliveries: result.rows,
      });
    } catch (error) {
      console.error("❌ Get user deliveries error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching user deliveries",
      });
    }
  },
};
