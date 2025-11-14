// components/SocketDebug.jsx
import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socketService';

const SocketDebug = () => {
  const [socketStatus, setSocketStatus] = useState(socketService.getStatus());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSocketStatus(socketService.getStatus());
    }, 2000);

    // Listen for demo events
    socketService.on('delivery_created', (data) => {
      setEvents(prev => [...prev, { type: 'delivery_created', data, timestamp: new Date() }].slice(-10));
    });

    socketService.on('delivery_status_updated', (data) => {
      setEvents(prev => [...prev, { type: 'delivery_status_updated', data, timestamp: new Date() }].slice(-10));
    });

    return () => clearInterval(interval);
  }, []);

  const manuallyConnect = () => {
    socketService.connect();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">WebSocket Debug</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${socketStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Status: {socketStatus.isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div>Socket ID: {socketStatus.socketId || 'None'}</div>
        <button 
          onClick={manuallyConnect}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Connect
        </button>
        
        <div className="mt-2">
          <h4 className="font-semibold">Recent Events:</h4>
          {events.length === 0 ? (
            <p className="text-gray-400">No events received</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="text-xs border-l-2 border-green-500 pl-2 mt-1">
                {event.type} at {event.timestamp.toLocaleTimeString()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocketDebug;