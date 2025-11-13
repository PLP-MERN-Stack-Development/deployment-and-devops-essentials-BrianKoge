// models/User.js - User model for MongoDB

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  room: {
    type: String,
    default: 'general',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
userSchema.index({ socketId: 1 });
userSchema.index({ room: 1 });

module.exports = mongoose.model('User', userSchema);

