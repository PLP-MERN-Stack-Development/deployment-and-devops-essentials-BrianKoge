// models/Message.js - Message model for MongoDB

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  room: {
    type: String,
    required: true,
    default: 'general',
    index: true, // Index for faster queries
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  recipient: {
    type: String,
    default: null,
  },
  recipientId: {
    type: String,
    default: null,
  },
  readBy: [{
    type: String,
  }],
  reactions: {
    type: Map,
    of: [String],
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // Index for faster queries
  },
}, {
  timestamps: true,
});

// Index for efficient querying
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);

