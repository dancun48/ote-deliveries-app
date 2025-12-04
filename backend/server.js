import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { testConnection } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import deliveryRoutes from "./routes/deliveries.js";
import adminRoutes from "./routes/admin.js";
import driverRoutes from "./routes/drivers.js";

// Load environment variables based on environment
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server for Socket.io
const server = createServer(app);

// Define allowed origins for CORS
const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://oteuser.vercel.app",
    "https://oteadmin.vercel.app",
  ];

  // Add environment-specific URLs
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }
  if (process.env.ADMIN_URL) {
    origins.push(process.env.ADMIN_URL);
  }

  // Add from CORS_ORIGINS if specified
  if (process.env.CORS_ORIGINS) {
    const additionalOrigins = process.env.CORS_ORIGINS.split(",");
    origins.push(...additionalOrigins);
  }

  // Remove duplicates
  return [...new Set(origins.filter(Boolean))];
};

const allowedOrigins = getAllowedOrigins();

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Rate limiting - increase for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 1000 : 100,
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    console.log("No token provided for socket connection");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.log("Socket authentication failed:", error.message);
    next(new Error("Authentication error"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id, "User:", socket.user?.email);

  if (socket.user?.isAdmin) {
    socket.join("admins");
    console.log("👨‍💼 Admin joined admins room:", socket.user.email);
  } else {
    socket.join(`user_${socket.user.id}`);
    console.log("👤 User joined personal room:", socket.user.email);
  }

  socket.on("disconnect", (reason) => {
    console.log("🔌 Client disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });
});

// Export utilities
export const emitToAdmins = (event, data) => {
  io.to("admins").emit(event, data);
  console.log(`📢 Emitted ${event} to admins`);
};
export { io };

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drivers", driverRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  const connectedAdmins = io.sockets.adapter.rooms.get("admins")?.size || 0;

  res.json({
    success: true,
    message: "Delivery API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    websocket: {
      connectedClients: io.engine.clientsCount,
      connectedAdmins: connectedAdmins,
    },
    allowedOrigins: allowedOrigins,
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 OTE Deliveries Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      deliveries: '/api/deliveries',
      admin: '/api/admin',
      drivers: '/api/drivers',
      health: '/api/health'
    },
    documentation: 'Coming soon...'
  });
});

// Optional: Add a /api route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'OTE Deliveries API',
    availableEndpoints: [
      '/api/auth',
      '/api/deliveries', 
      '/api/admin',
      '/api/drivers',
      '/api/health'
    ]
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.get('/api/db-structure', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    // Get table structures
    const tableStructures = {};
    for (const table of tablesResult.rows) {
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table.table_name]);
      
      tableStructures[table.table_name] = columnsResult.rows;
    }
    
    client.release();
    
    res.json({
      success: true,
      tables: tablesResult.rows,
      structures: tableStructures
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      tables: []
    });
  }
});


// Start server with graceful database handling
const startServer = async () => {
  // Start server immediately
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 Allowed Origins: ${allowedOrigins.join(", ")}`);
    
    // Try database connection in background (non-blocking)
    setTimeout(async () => {
      try {
        const dbConnected = await testConnection();
        if (dbConnected) {
          console.log("✅ Database connected successfully");
        } else {
          console.log("⚠️  Running without database connection");
          console.log("⚠️  Some database-dependent features may not work");
        }
      } catch (error) {
        console.log("⚠️  Database connection failed silently:", error.message);
      }
    }, 2000); // Delay to let server start first
  });
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.log("⚠️  Server continuing in limited mode...");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();