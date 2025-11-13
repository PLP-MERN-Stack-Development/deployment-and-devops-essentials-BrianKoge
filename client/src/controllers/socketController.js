// controllers/socketController.js - Handle socket events

class SocketController {
  constructor(io) {
    this.io = io;
    this.users = new Map(); // Store connected users
    this.messages = []; // Store messages in memory
    this.typingUsers = new Set(); // Store typing users
    this.rooms = new Map(); // Store chat rooms
  }

  // Handle new socket connection
  handleConnection(socket) {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on('user_join', (data) => {
      this.handleUserJoin(socket, data);
    });

    // Handle sending message
    socket.on('send_message', (data) => {
      this.handleSendMessage(socket, data);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      this.handleTyping(socket, data);
    });

    // Handle private messaging
    socket.on('private_message', (data) => {
      this.handlePrivateMessage(socket, data);
    });

    // Handle joining a room
    socket.on('join_room', (data) => {
      this.handleJoinRoom(socket, data);
    });

    // Handle leaving a room
    socket.on('leave_room', (data) => {
      this.handleLeaveRoom(socket, data);
    });

    // Handle room message
    socket.on('room_message', (data) => {
      this.handleRoomMessage(socket, data);
    });

    // Handle message reaction
    socket.on('message_reaction', (data) => {
      this.handleMessageReaction(socket, data);
    });

    // Handle message read
    socket.on('message_read', (data) => {
      this.handleMessageRead(socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  // Handle user joining
  handleUserJoin(socket, { username, room = 'general' }) {
    // Store user info
    this.users.set(socket.id, { 
      id: socket.id, 
      username, 
      room,
      joinedAt: new Date()
    });

    // Join the specified room
    socket.join(room);

    // Add room to rooms map if it doesn't exist
    if (!this.rooms.has(room)) {
      this.rooms.set(room, {
        name: room,
        users: new Set(),
        createdAt: new Date()
      });
    }

    // Add user to room
    this.rooms.get(room).users.add(socket.id);

    // Notify all users in the room
    this.io.to(room).emit('user_joined', {
      id: socket.id,
      username,
      room,
      timestamp: new Date().toISOString()
    });

    // Send current user list to the room
    const roomUsers = Array.from(this.rooms.get(room).users)
      .map(userId => this.users.get(userId))
      .filter(user => user !== undefined);

    this.io.to(room).emit('room_users', roomUsers);

    console.log(`${username} joined room ${room}`);
  }

  // Handle sending message
  handleSendMessage(socket, { message, room = 'general' }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    const messageData = {
      id: Date.now() + Math.random(),
      sender: user.username,
      senderId: socket.id,
      message,
      room,
      timestamp: new Date().toISOString(),
      readBy: [socket.id], // Sender has read their own message
      reactions: {} // Store reactions by emoji
    };

    // Store message
    this.messages.push(messageData);

    // Limit stored messages to prevent memory issues
    if (this.messages.length > 1000) {
      this.messages.shift();
    }

    // Broadcast message to room
    this.io.to(room).emit('receive_message', messageData);

    console.log(`Message from ${user.username} in room ${room}: ${message}`);
  }

  // Handle typing indicator
  handleTyping(socket, { isTyping, room = 'general' }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    if (isTyping) {
      this.typingUsers.add(socket.id);
    } else {
      this.typingUsers.delete(socket.id);
    }

    // Get typing users in the room
    const typingUsersInRoom = Array.from(this.typingUsers)
      .map(userId => this.users.get(userId))
      .filter(user => user && user.room === room)
      .map(user => user.username);

    // Broadcast typing status to room
    this.io.to(room).emit('typing_users', typingUsersInRoom);
  }

  // Handle private messaging
  handlePrivateMessage(socket, { to, message }) {
    const sender = this.users.get(socket.id);
    const recipient = Array.from(this.users.values()).find(user => user.id === to);
    
    if (!sender || !recipient) return;

    const messageData = {
      id: Date.now() + Math.random(),
      sender: sender.username,
      senderId: socket.id,
      recipient: recipient.username,
      recipientId: to,
      message,
      isPrivate: true,
      timestamp: new Date().toISOString(),
      readBy: [socket.id], // Sender has read their own message
      reactions: {} // Store reactions by emoji
    };

    // Store message
    this.messages.push(messageData);

    // Send message to recipient
    this.io.to(to).emit('private_message', messageData);

    // Also send to sender (for confirmation)
    socket.emit('private_message', messageData);

    console.log(`Private message from ${sender.username} to ${recipient.username}: ${message}`);
  }

  // Handle joining a room
  handleJoinRoom(socket, { room }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    // Leave current room
    socket.leave(user.room);

    // Remove user from previous room
    if (this.rooms.has(user.room)) {
      this.rooms.get(user.room).users.delete(socket.id);
    }

    // Update user's room
    user.room = room;
    this.users.set(socket.id, user);

    // Join new room
    socket.join(room);

    // Add room to rooms map if it doesn't exist
    if (!this.rooms.has(room)) {
      this.rooms.set(room, {
        name: room,
        users: new Set(),
        createdAt: new Date()
      });
    }

    // Add user to room
    this.rooms.get(room).users.add(socket.id);

    // Notify all users in the new room
    this.io.to(room).emit('user_joined_room', {
      id: socket.id,
      username: user.username,
      room,
      timestamp: new Date().toISOString()
    });

    // Send current user list to the room
    const roomUsers = Array.from(this.rooms.get(room).users)
      .map(userId => this.users.get(userId))
      .filter(user => user !== undefined);

    this.io.to(room).emit('room_users', roomUsers);

    // Send room message history
    const roomMessages = this.messages.filter(msg => msg.room === room);
    socket.emit('room_messages', roomMessages);

    console.log(`${user.username} joined room ${room}`);
  }

  // Handle leaving a room
  handleLeaveRoom(socket, { room }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    // Leave room
    socket.leave(room);

    // Remove user from room
    if (this.rooms.has(room)) {
      this.rooms.get(room).users.delete(socket.id);
    }

    // Notify all users in the room
    this.io.to(room).emit('user_left_room', {
      id: socket.id,
      username: user.username,
      room,
      timestamp: new Date().toISOString()
    });

    console.log(`${user.username} left room ${room}`);
  }

  // Handle room message
  handleRoomMessage(socket, { room, message }) {
    this.handleSendMessage(socket, { message, room });
  }

  // Handle message reaction
  handleMessageReaction(socket, { messageId, reaction }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    // Find the message
    const message = this.messages.find(msg => msg.id === messageId);
    if (!message) return;

    // Initialize reactions object if it doesn't exist
    if (!message.reactions) {
      message.reactions = {};
    }

    // Initialize reaction array if it doesn't exist
    if (!message.reactions[reaction]) {
      message.reactions[reaction] = [];
    }

    // Check if user already reacted with this emoji
    const userIndex = message.reactions[reaction].indexOf(socket.id);
    
    if (userIndex === -1) {
      // Add reaction
      message.reactions[reaction].push(socket.id);
    } else {
      // Remove reaction
      message.reactions[reaction].splice(userIndex, 1);
      
      // Remove emoji key if no reactions left
      if (message.reactions[reaction].length === 0) {
        delete message.reactions[reaction];
      }
    }

    // Broadcast updated message to room
    this.io.to(message.room).emit('message_updated', message);
  }

  // Handle message read
  handleMessageRead(socket, { messageId }) {
    const user = this.users.get(socket.id);
    if (!user) return;

    // Find the message
    const message = this.messages.find(msg => msg.id === messageId);
    if (!message) return;

    // Initialize readBy array if it doesn't exist
    if (!message.readBy) {
      message.readBy = [];
    }

    // Add user to readBy if not already there
    if (!message.readBy.includes(socket.id)) {
      message.readBy.push(socket.id);
      
      // Broadcast updated message to room
      this.io.to(message.room).emit('message_updated', message);
    }
  }

  // Handle disconnection
  handleDisconnect(socket) {
    const user = this.users.get(socket.id);
    if (!user) return;

    // Remove user from their room
    if (this.rooms.has(user.room)) {
      this.rooms.get(user.room).users.delete(socket.id);
    }

    // Remove user from typing users
    this.typingUsers.delete(socket.id);

    // Remove user
    this.users.delete(socket.id);

    // Notify all users in the room
    this.io.to(user.room).emit('user_left', {
      id: socket.id,
      username: user.username,
      room: user.room,
      timestamp: new Date().toISOString()
    });

    // Send updated user list to the room
    const roomUsers = Array.from(this.rooms.get(user.room).users)
      .map(userId => this.users.get(userId))
      .filter(user => user !== undefined);

    this.io.to(user.room).emit('room_users', roomUsers);

    console.log(`${user.username} disconnected`);
  }
}

module.exports = SocketController;