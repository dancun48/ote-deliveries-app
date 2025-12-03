import { Delivery } from "../models/Delivery.js";
import { emitToAdmins } from "../server.js";

// Generate tracking number
const generateTrackingNumber = () => {
  return "TRK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const deliveryController = {
  // Create delivery - UPDATED to include pricing data
  async createDelivery(req, res) {
    try {
      const {
        pickupAddress,
        deliveryAddress,
        recipientName,
        recipientPhone,
        packageDescription,
        packageWeight,
        numberOfBoxes = 1,
        zone,
        basePrice = 0,
        additionalBoxPrice = 0,
        totalPrice = 0,
      } = req.body;

      // Validate required fields
      if (!pickupAddress || !deliveryAddress || !recipientName || !recipientPhone) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: pickupAddress, deliveryAddress, recipientName, recipientPhone",
        });
      }

      const trackingNumber = generateTrackingNumber();

      const delivery = await Delivery.create({
        trackingNumber,
        userId: req.userId,
        pickupAddress,
        deliveryAddress,
        recipientName,
        recipientPhone,
        packageDescription: packageDescription || "",
        packageWeight: packageWeight || null,
        numberOfBoxes,
        zone,
        basePrice,
        additionalBoxPrice,
        totalPrice,
      });

      console.log("✅ Delivery created successfully with pricing:", {
        id: delivery.id,
        trackingNumber: delivery.tracking_number,
        boxes: delivery.number_of_boxes,
        totalPrice: delivery.total_price,
      });
      
      // Emit event to admins with pricing info
      if (delivery) {
        emitToAdmins("delivery_created", {
          id: delivery.id,
          tracking_number: delivery.tracking_number,
          customer_name: `${req.user.first_name} ${req.user.last_name}`,
          recipient_name: delivery.recipient_name,
          status: delivery.status,
          number_of_boxes: delivery.number_of_boxes,
          total_price: delivery.total_price,
          zone: delivery.zone,
          created_at: delivery.created_at,
          timestamp: new Date(),
        });
      }

      res.status(201).json({
        success: true,
        message: "Delivery created successfully",
        data: {
          delivery: {
            id: delivery.id,
            trackingNumber: delivery.tracking_number,
            status: delivery.status,
            recipientName: delivery.recipient_name,
            pickupAddress: delivery.pickup_address,
            deliveryAddress: delivery.delivery_address,
            numberOfBoxes: delivery.number_of_boxes,
            zone: delivery.zone,
            basePrice: delivery.base_price,
            additionalBoxPrice: delivery.additional_box_price,
            totalPrice: delivery.total_price,
            createdAt: delivery.created_at
          }
        }
      });
    } catch (error) {
      console.error("❌ Create delivery error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating delivery",
        error: error.message,
      });
    }
  },

  // Get user's deliveries
  async getUserDeliveries(req, res) {
    try {
      const deliveries = await Delivery.findByUserId(req.userId);
      res.json({
        success: true,
        data: {
          deliveries
        }
      });
    } catch (error) {
      console.error("❌ Get deliveries error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching deliveries",
      });
    }
  },

  // Track delivery
  async trackDelivery(req, res) {
    try {
      const { trackingNumber } = req.params;
      const delivery = await Delivery.findByTrackingNumber(trackingNumber);
      if (!delivery) {
        console.log("❌ Delivery not found:", trackingNumber);
        return res.status(404).json({
          success: false,
          message: "Delivery not found",
        });
      }

      res.json({
        success: true,
        data: {
          delivery
        }
      });
    } catch (error) {
      console.error("❌ Track delivery error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while tracking delivery",
      });
    }
  },

  // Get all deliveries (admin) - UNCHANGED
  async getAllDeliveries(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const deliveries = await Delivery.findAll(limit, offset);
      const total = await Delivery.count();
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          deliveries,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
          }
        }
      });
    } catch (error) {
      console.error("❌ Get all deliveries error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching deliveries",
      });
    }
  },

  // NEW: Get delivery revenue statistics
  async getRevenueStats(req, res) {
    try {
      const stats = await Delivery.getRevenueStats();
      
      // Calculate additional metrics
      const averageBoxesPerDelivery = stats.total_boxes / Math.max(stats.total_deliveries, 1);
      const completionRate = (stats.completed_deliveries / Math.max(stats.total_deliveries, 1)) * 100;
      
      res.json({
        success: true,
        data: {
          ...stats,
          averageBoxesPerDelivery: parseFloat(averageBoxesPerDelivery.toFixed(2)),
          completionRate: parseFloat(completionRate.toFixed(2)),
          deliveredRevenue: parseFloat(stats.delivered_revenue),
          totalRevenue: parseFloat(stats.total_revenue),
        }
      });
    } catch (error) {
      console.error("❌ Get revenue stats error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching revenue statistics",
      });
    }
  },

  // NEW: Get zone-wise statistics
  async getZoneStats(req, res) {
    try {
      const zoneStats = await Delivery.getZoneStats();
      
      res.json({
        success: true,
        data: {
          zones: zoneStats,
          totalZones: zoneStats.length
        }
      });
    } catch (error) {
      console.error("❌ Get zone stats error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching zone statistics",
      });
    }
  },
};