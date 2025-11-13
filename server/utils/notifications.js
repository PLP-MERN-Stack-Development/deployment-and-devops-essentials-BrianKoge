// utils/notifications.js - Utility functions for notifications

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // Send browser notification to a specific user
  sendBrowserNotification(userId, title, body, icon = '/notification-icon.png') {
    this.io.to(userId).emit('browser_notification', {
      title,
      body,
      icon,
      timestamp: new Date().toISOString()
    });
  }

  // Send sound notification to a room
  sendSoundNotification(room, sound = 'message') {
    this.io.to(room).emit('sound_notification', {
      sound,
      timestamp: new Date().toISOString()
    });
  }

  // Send unread message count to a user
  sendUnreadCount(userId, count) {
    this.io.to(userId).emit('unread_count', {
      count,
      timestamp: new Date().toISOString()
    });
  }

  // Send notification to all users in a room
  sendRoomNotification(room, message, type = 'info') {
    this.io.to(room).emit('room_notification', {
      message,
      type,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = NotificationService;