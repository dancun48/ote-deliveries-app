import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';
import deliveryRoutes from './routes/deliveries.js';
import adminRoutes from './routes/admin.js';
import driverRoutes from './routes/drivers.js';

// Loading environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server for Socket.io
const server = createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io middleware for authentication
io.use((socket, next) => {
  // Get token from handshake auth or query string
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  
  if (!token) {
    console.log('No token provided for socket connection');
    return next(new Error('Authentication error'));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.log('Socket authentication failed:', error.message);
    next(new Error('Authentication error'));
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id, 'User:', socket.user?.email);
  
  // Join admin room if user is admin
  if (socket.user?.isAdmin) {
    socket.join('admins');
    console.log('👨‍💼 Admin joined admins room:', socket.user.email);
  } else {
    // Regular users can join their own room for personal updates
    socket.join(`user_${socket.user.id}`);
    console.log('👤 User joined personal room:', socket.user.email);
  }

  // Handle client disconnection
  socket.on('disconnect', (reason) => {
    console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
  });

  // Handle socket errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Create a function to emit events to admins
export const emitToAdmins = (event, data) => {
  io.to('admins').emit(event, data);
  console.log(`📢 Emitted ${event} to admins`);
};

// Export io instance to use in other files
export { io };

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/drivers', driverRoutes);

// Health check route (now includes WebSocket status)
app.get('/api/health', (req, res) => {
  const connectedAdmins = io.sockets.adapter.rooms.get('admins')?.size || 0;
  
  res.json({ 
    success: true,
    message: 'Delivery API is running!',
    timestamp: new Date().toISOString(),
    websocket: {
      connectedClients: io.engine.clientsCount,
      connectedAdmins: connectedAdmins
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server (changed from app.listen to server.listen)
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();