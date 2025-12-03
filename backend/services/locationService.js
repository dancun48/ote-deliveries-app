// services/locationService.js
class LocationService {
  constructor() {
    this.driverLocations = new Map(); // Store driver locations
    this.deliveryTracking = new Map(); // Store delivery tracking data
  }

  // Update driver location
  updateDriverLocation(driverId, location) {
    const locationData = {
      driverId,
      latitude: location.lat,
      longitude: location.lng,
      timestamp: new Date(),
      deliveryId: location.deliveryId
    };

    this.driverLocations.set(driverId, locationData);
    
    // Store tracking history
    if (location.deliveryId) {
      if (!this.deliveryTracking.has(location.deliveryId)) {
        this.deliveryTracking.set(location.deliveryId, []);
      }
      this.deliveryTracking.get(location.deliveryId).push(locationData);
    }

    return locationData;
  }

  // Get driver location
  getDriverLocation(driverId) {
    return this.driverLocations.get(driverId);
  }

  // Get delivery tracking history
  getDeliveryTracking(deliveryId) {
    return this.deliveryTracking.get(deliveryId) || [];
  }

  // Get all active delivery locations
  getActiveDeliveryLocations() {
    const activeLocations = [];
    for (const [driverId, location] of this.driverLocations) {
      if (location.deliveryId) {
        activeLocations.push(location);
      }
    }
    return activeLocations;
  }
}

module.exports = new LocationService();