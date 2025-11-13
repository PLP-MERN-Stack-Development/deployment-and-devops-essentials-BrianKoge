// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');
const SocketController = require('./controllers/socketController');
const { securityHeaders, apiLimiter } = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { getLogger, errorLogger } = require('./utils/logger');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  connectDB();
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Support both transports
});

// Security middleware (must be first)
app.use(securityHeaders);

// Compression middleware (compress responses)
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Logging middleware
app.use(getLogger());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'connected' : 'not configured',
  });
});

// API routes
app.get('/api/messages', async (req, res, next) => {
  try {
    const socketController = req.app.get('socketController');
    res.json(socketController.messages || []);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users', async (req, res, next) => {
  try {
    const socketController = req.app.get('socketController');
    res.json(Array.from(socketController.users.values()));
  } catch (error) {
    next(error);
  }
});

app.get('/api/rooms', async (req, res, next) => {
  try {
    const socketController = req.app.get('socketController');
    const rooms = Array.from(socketController.rooms.entries()).map(([name, room]) => ({
      name,
      userCount: room.users.size,
      createdAt: room.createdAt
    }));
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Socket.io Chat Server is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      messages: '/api/messages',
      users: '/api/users',
      rooms: '/api/rooms',
    },
  });
});

// Initialize socket controller
const socketController = new SocketController(io);
app.set('socketController', socketController);

// Socket.io connection handler
io.on('connection', (socket) => {
  socketController.handleConnection(socket);
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.MONGODB_URI) {
    console.log('MongoDB: Connected');
  } else {
    console.log('MongoDB: Not configured (using in-memory storage)');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };