const locationService = require('../services/locationService');

exports.trackingController = {
  // Update driver location (from driver app)
  async updateDriverLocation(req, res) {
    try {
      const { driverId } = req.params;
      const { latitude, longitude, deliveryId } = req.body;

      const location = locationService.updateDriverLocation(driverId, {
        lat: latitude,
        lng: longitude,
        deliveryId
      });

      // Emit real-time update
      if (req.io) {
        req.io.to('admins').emit('driver_location_updated', location);
        req.io.to(`delivery_${deliveryId}`).emit('delivery_location_updated', location);
      }

      res.json({
        success: true,
        message: 'Location updated successfully',
        location
      });
    } catch (error) {
      console.error('❌ Error updating driver location:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating location'
      });
    }
  },

  // Get delivery tracking history
  async getDeliveryTracking(req, res) {
    try {
      const { deliveryId } = req.params;
      
      const trackingHistory = locationService.getDeliveryTracking(deliveryId);
      
      res.json({
        success: true,
        trackingHistory
      });
    } catch (error) {
      console.error('❌ Error fetching tracking history:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching tracking history'
      });
    }
  },

  // Get current driver location
  async getDriverLocation(req, res) {
    try {
      const { driverId } = req.params;
      
      const location = locationService.getDriverLocation(driverId);
      
      res.json({
        success: true,
        location
      });
    } catch (error) {
      console.error('❌ Error fetching driver location:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching driver location'
      });
    }
  }
};