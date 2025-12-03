// services/socketService.js - Add tracking events
socketService.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Driver sends location updates
  socket.on('driver_location_update', async (data) => {
    try {
      const { driverId, latitude, longitude, deliveryId } = data;
      
      const location = locationService.updateDriverLocation(driverId, {
        lat: latitude,
        lng: longitude,
        deliveryId
      });

      // Broadcast to admin and relevant users
      socket.to('admins').emit('driver_location_updated', location);
      socket.to(`delivery_${deliveryId}`).emit('delivery_location_updated', location);
      
      console.log(`📍 Driver ${driverId} location updated`);
    } catch (error) {
      console.error('❌ Error updating driver location:', error);
    }
  });

  // Admin/Dashboard joins delivery tracking room
  socket.on('join_delivery_tracking', (deliveryId) => {
    socket.join(`delivery_${deliveryId}`);
    console.log(`👀 User joined delivery tracking: ${deliveryId}`);
  });

  // Request current location
  socket.on('get_driver_location', (driverId) => {
    const location = locationService.getDriverLocation(driverId);
    socket.emit('current_driver_location', location);
  });
});