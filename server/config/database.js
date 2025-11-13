// config/database.js - MongoDB connection configuration

const mongoose = require('mongoose');

const connectDB = async () => {
  // Don't attempt connection if MONGODB_URI is not set
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB URI not provided. Running without database (in-memory storage).');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 10000, // Increased timeout for cloud connections
      socketTimeoutMS: 45000, // How long to wait for a socket to be established
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('The application will continue running without database (in-memory storage).');
    console.error('To fix MongoDB connection:');
    console.error('1. Check your MongoDB Atlas IP whitelist includes Render IPs (or 0.0.0.0/0)');
    console.error('2. Verify MONGODB_URI is correct');
    console.error('3. Check network connectivity');
    // Don't exit - allow app to run without database
    return null;
  }
};

module.exports = connectDB;

