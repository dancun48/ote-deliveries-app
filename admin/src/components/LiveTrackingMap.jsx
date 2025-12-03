// components/LiveTrackingMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';

const LiveTrackingMap = ({ delivery, driver }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (delivery?.id) {
      // Join delivery tracking room
      socketService.emit('join_delivery_tracking', delivery.id);
      
      // Start tracking
      startTracking();
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [delivery?.id]);

  useEffect(() => {
    // Listen for location updates
    socketService.on('delivery_location_updated', (location) => {
      if (location.deliveryId === delivery?.id) {
        setDriverLocation(location);
        updateMapMarker(location);
        addToTrackingHistory(location);
      }
    });

    return () => {
      socketService.off('delivery_location_updated');
    };
  }, [delivery?.id]);

  const startTracking = async () => {
    try {
      setIsTracking(true);
      
      // Load Google Maps if not already loaded
      if (!window.google) {
        await loadGoogleMaps();
      }
      
      // Initialize map
      initializeMap();
      
      // Request current location
      if (driver?.id) {
        socketService.emit('get_driver_location', driver.id);
      }
      
    } catch (error) {
      console.error('❌ Error starting tracking:', error);
    }
  };

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const initializeMap = () => {
    const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Add delivery route if we have pickup and delivery addresses
    if (delivery?.pickup_address && delivery?.delivery_address) {
      calculateAndDisplayRoute(delivery.pickup_address, delivery.delivery_address);
    }
  };

  const updateMapMarker = (location) => {
    if (!mapInstanceRef.current) return;

    const position = { lat: location.latitude, lng: location.longitude };

    // Center map on driver location
    mapInstanceRef.current.setCenter(position);

    if (!markerRef.current) {
      // Create new marker
      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        title: `Driver: ${driver?.name || 'Unknown'}`,
        icon: {
          url: '/driver-marker.png', // Custom driver icon
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    } else {
      // Update existing marker position
      markerRef.current.setPosition(position);
    }
  };

  const calculateAndDisplayRoute = (startAddress, endAddress) => {
    if (!window.google || !mapInstanceRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(mapInstanceRef.current);

    directionsService.route(
      {
        origin: startAddress,
        destination: endAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Error calculating route:', status);
        }
      }
    );
  };

  const addToTrackingHistory = (location) => {
    setTrackingHistory(prev => {
      const newHistory = [...prev, location];
      // Keep only last 50 points to prevent memory issues
      return newHistory.slice(-50);
    });
  };

  const getEstimatedTime = () => {
    if (!driverLocation || !delivery?.delivery_address) return null;

    // Simple estimation - in real app, use Google Maps Distance Matrix API
    return '15-20 minutes'; // Placeholder
  };

  return (
    <div className="space-y-4">
      {/* Tracking Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Live Tracking</h3>
          <p className="text-sm text-gray-600">
            Tracking delivery #{delivery?.tracking_number}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isTracking ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />

      {/* Tracking Info */}
      {driverLocation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Current Location</h4>
            <p className="text-sm">
              Lat: {driverLocation.latitude.toFixed(6)}, Lng: {driverLocation.longitude.toFixed(6)}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Last Updated</h4>
            <p className="text-sm">
              {new Date(driverLocation.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Estimated Arrival</h4>
            <p className="text-sm font-medium text-green-600">
              {getEstimatedTime()}
            </p>
          </div>
        </div>
      )}

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold">Tracking History</h4>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {trackingHistory.slice(-10).reverse().map((point, index) => (
              <div key={index} className="p-3 border-b border-gray-100 text-sm">
                <div className="flex justify-between">
                  <span>
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </span>
                  <span className="text-gray-500">
                    {new Date(point.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isTracking && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p>Tracking will start when driver begins delivery</p>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;