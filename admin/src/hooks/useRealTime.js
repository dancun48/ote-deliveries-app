// hooks/useRealTime.js
import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export const useRealTime = () => {
  const [realTimeData, setRealTimeData] = useState({
    newDeliveries: 0,
    statusUpdates: [],
    userActivity: []
  });

  useEffect(() => {
    // Listen for delivery updates
    socketService.on('delivery_created', (delivery) => {
      setRealTimeData(prev => ({
        ...prev,
        newDeliveries: prev.newDeliveries + 1,
        userActivity: [
          { type: 'new_delivery', data: delivery, timestamp: new Date() },
          ...prev.userActivity.slice(0, 9) // Keep last 10
        ]
      }));
    });

    socketService.on('delivery_status_updated', (update) => {
      setRealTimeData(prev => ({
        ...prev,
        statusUpdates: [
          update,
          ...prev.statusUpdates.slice(0, 9) // Keep last 10
        ]
      }));
    });

    socketService.on('user_registered', (user) => {
      setRealTimeData(prev => ({
        ...prev,
        userActivity: [
          { type: 'user_registered', data: user, timestamp: new Date() },
          ...prev.userActivity.slice(0, 9)
        ]
      }));
    });

    return () => {
      socketService.socket?.off('delivery_created');
      socketService.socket?.off('delivery_status_updated');
      socketService.socket?.off('user_registered');
    };
  }, []);

  return realTimeData;
};