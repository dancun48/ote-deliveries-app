// services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map(); // Store callbacks for reconnection
  }

  connect() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No token available for WebSocket connection');
        return;
      }

      if (this.socket && this.isConnected) {
        console.log('🔌 WebSocket already connected');
        return this.socket;
      }

      console.log('🔌 Connecting to WebSocket...');
      this.socket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'] // Add fallback transports
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected successfully');
        this.isConnected = true;
        
        // Re-register all event listeners after reconnection
        this.eventCallbacks.forEach((callback, event) => {
          this.socket.on(event, callback);
        });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.isConnected = false;
      });

      this.socket.on('delivery_created', (data) => {
        console.log('📦 Real-time: Delivery created', data);
      });

      this.socket.on('delivery_status_updated', (data) => {
        console.log('🔄 Real-time: Delivery status updated', data);
      });

      this.socket.on('user_registered', (data) => {
        console.log('👤 Real-time: User registered', data);
      });

      return this.socket;

    } catch (error) {
      console.error('🚨 Socket connection failed:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventCallbacks.clear();
    }
  }

  on(event, callback) {
    // Store the callback for reconnection
    this.eventCallbacks.set(event, callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
      console.log(`🎯 Registered listener for: ${event}`);
    } else {
      console.log(`⏳ Listener queued for: ${event} (socket not connected)`);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      console.log(`📤 Emitting event: ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit ${event}: Socket not connected`);
    }
  }

  // Helper method to check connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      connectedAt: this.socket?.connected
    };
  }
}

export const socketService = new SocketService();