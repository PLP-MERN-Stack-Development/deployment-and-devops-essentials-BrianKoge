// App.jsx - Main application component

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from './socket/socket';
import MessageList from './components/MessageList';
import Notification from './components/Notification';
import Sidebar from './components/Sidebar';

const App = () => {
  const { 
    isConnected, 
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
    setTyping,
    joinRoom,
    addReaction,
    markAsRead,
    loadMoreMessages,
    searchMessages
  } = useSocket();
  
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState('general');
  const [rooms] = useState(['general', 'random', 'tech', 'gaming']);
  const [activeNotifications, setActiveNotifications] = useState([]);
  const typingTimeoutRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  // Handle notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setActiveNotifications(prev => [...prev, { ...latestNotification, id: Date.now() }]);
      
      // Auto-remove notification after 5 seconds
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = setTimeout(() => {
        setActiveNotifications(prev => prev.slice(1));
      }, 5000);
    }
  }, [notifications]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username, room);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message, room);
      setMessage('');
      setTyping(false, room);
    }
  };

  const handleLogout = () => {
    disconnect();
    setIsLoggedIn(false);
    setUsername('');
    setRoom('general');
    setActiveNotifications([]);
  };

  const handleRoomChange = (newRoom) => {
    joinRoom(newRoom);
    setRoom(newRoom);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(true, room);
    
    // Clear typing indicator after 500ms of inactivity
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false, room);
    }, 500);
  };

  const handleReact = (messageId, reaction) => {
    addReaction(messageId, reaction);
  };

  const handleMarkAsRead = (messageId) => {
    markAsRead(messageId);
  };

  const handleLoadMore = (beforeTimestamp) => {
    loadMoreMessages(beforeTimestamp);
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      searchMessages(query);
    } else {
      // Reload recent messages when search is cleared
      joinRoom(currentRoom);
    }
  };

  const closeNotification = (id) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              SocketChat
            </h1>
            <p className="text-gray-400">Real-time messaging platform</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-300 mb-2 font-medium">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border border-gray-600"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="room" className="block text-gray-300 mb-2 font-medium">Chat Room</label>
              <select
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border border-gray-600"
              >
                {rooms.map((r) => (
                  <option key={r} value={r} className="bg-gray-700">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Join Chat
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {activeNotifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => closeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-gray-800 p-4 shadow-lg border-b border-gray-700"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              SocketChat
            </h1>
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
              <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-300 text-sm">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-gray-300 flex items-center">
              Room: <span className="font-semibold text-blue-400 ml-1">{currentRoom}</span>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center"
            >
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          users={users}
          typingUsers={typingUsers}
          unreadCount={unreadCount}
          onRoomChange={handleRoomChange}
          onSearch={handleSearch}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <MessageList
            messages={messages}
            currentUser={username}
            onReact={handleReact}
            onMarkAsRead={handleMarkAsRead}
            onLoadMore={handleLoadMore}
            hasMoreMessages={hasMoreMessages}
          />

          {/* Message Input */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gray-800 p-4 border-t border-gray-700"
          >
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border border-gray-600"
                placeholder="Type your message..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!message.trim()}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${
                  !message.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Send
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default App;