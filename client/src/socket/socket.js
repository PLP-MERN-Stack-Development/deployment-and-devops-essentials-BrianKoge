// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Log the socket URL in development (helps debug CORS issues)
if (import.meta.env.DEV) {
  console.log('Socket.io connecting to:', SOCKET_URL);
  console.log('VITE_SOCKET_URL env var:', import.meta.env.VITE_SOCKET_URL || 'not set (using default)');
}

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // Connect to socket server
  const connect = (username, room = 'general') => {
    socket.connect();
    if (username) {
      socket.emit('user_join', { username, room });
      setCurrentRoom(room);
      setMessages([]);
      setHasMoreMessages(true);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Send a message
  const sendMessage = (message, room = currentRoom) => {
    if (room === 'general' || room === currentRoom) {
      socket.emit('send_message', { message, room });
    } else {
      socket.emit('room_message', { room, message });
    }
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Set typing status
  const setTyping = (isTyping, room = currentRoom) => {
    socket.emit('typing', { isTyping, room });
  };

  // Join a room
  const joinRoom = (room) => {
    socket.emit('join_room', { room });
    setCurrentRoom(room);
    setMessages([]);
    setHasMoreMessages(true);
  };

  // Leave a room
  const leaveRoom = (room) => {
    socket.emit('leave_room', { room });
  };

  // Add reaction to a message
  const addReaction = (messageId, reaction) => {
    socket.emit('message_reaction', { messageId, reaction });
  };

  // Mark message as read
  const markAsRead = (messageId) => {
    socket.emit('message_read', { messageId });
  };

  // Load more messages
  const loadMoreMessages = (beforeTimestamp) => {
    socket.emit('load_more_messages', { room: currentRoom, beforeTimestamp });
  };

  // Search messages
  const searchMessages = (query) => {
    socket.emit('search_messages', { room: currentRoom, query });
  };

  // Request permission for browser notifications
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Show browser notification
  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/notification-icon.png'
      });
    }
  };

  // Play sound
  const playSound = (sound) => {
    // In a real app, you would play an actual sound file
    console.log(`Playing sound: ${sound}`);
  };

  // Socket event listeners
  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission();

    // Connection events
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      
      // Increment unread count for non-sender messages
      if (message.sender !== socket.id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      
      // Increment unread count for non-sender messages
      if (message.senderId !== socket.id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const onRoomMessages = (roomMessages) => {
      setMessages(roomMessages);
    };

    const onMoreMessages = (data) => {
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMoreMessages(data.hasMore);
    };

    const onSearchResults = (searchResults) => {
      setMessages(searchResults);
    };

    const onMessageUpdated = (updatedMessage) => {
      setMessages((prev) => 
        prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
      );
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onRoomUsers = (roomUsers) => {
      setUsers(roomUsers);
    };

    const onUserJoined = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserJoinedRoom = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeftRoom = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Room events
    const onRoomList = (rooms) => {
      // Handle room list if needed
    };

    // Notification events
    const onBrowserNotification = (notification) => {
      showBrowserNotification(notification.title, notification.body);
      setNotifications(prev => [...prev, notification]);
    };

    const onSoundNotification = (soundData) => {
      playSound(soundData.sound);
    };

    const onUnreadCount = (data) => {
      setUnreadCount(data.count);
    };

    const onRoomNotification = (notification) => {
      setNotifications(prev => [...prev, notification]);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('room_messages', onRoomMessages);
    socket.on('more_messages', onMoreMessages);
    socket.on('search_results', onSearchResults);
    socket.on('message_updated', onMessageUpdated);
    socket.on('user_list', onUserList);
    socket.on('room_users', onRoomUsers);
    socket.on('user_joined', onUserJoined);
    socket.on('user_joined_room', onUserJoinedRoom);
    socket.on('user_left', onUserLeft);
    socket.on('user_left_room', onUserLeftRoom);
    socket.on('typing_users', onTypingUsers);
    socket.on('room_list', onRoomList);
    socket.on('browser_notification', onBrowserNotification);
    socket.on('sound_notification', onSoundNotification);
    socket.on('unread_count', onUnreadCount);
    socket.on('room_notification', onRoomNotification);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('room_messages', onRoomMessages);
      socket.off('more_messages', onMoreMessages);
      socket.off('search_results', onSearchResults);
      socket.off('message_updated', onMessageUpdated);
      socket.off('user_list', onUserList);
      socket.off('room_users', onRoomUsers);
      socket.off('user_joined', onUserJoined);
      socket.off('user_joined_room', onUserJoinedRoom);
      socket.off('user_left', onUserLeft);
      socket.off('user_left_room', onUserLeftRoom);
      socket.off('typing_users', onTypingUsers);
      socket.off('room_list', onRoomList);
      socket.off('browser_notification', onBrowserNotification);
      socket.off('sound_notification', onSoundNotification);
      socket.off('unread_count', onUnreadCount);
      socket.off('room_notification', onRoomNotification);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    currentRoom,
    unreadCount,
    notifications,
    hasMoreMessages,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    leaveRoom,
    addReaction,
    markAsRead,
    loadMoreMessages,
    searchMessages,
    requestNotificationPermission,
    showBrowserNotification,
    playSound,
  };
};

export default socket;