// components/Sidebar.jsx - Enhanced sidebar component

import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Users, Search } from 'lucide-react';
import SearchComponent from './Search';

const Sidebar = ({ 
  rooms, 
  currentRoom, 
  users, 
  typingUsers, 
  unreadCount, 
  onRoomChange, 
  onSearch 
}) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full"
    >
      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <SearchComponent onSearch={onSearch} placeholder="Search in room..." />
      </div>
      
      {/* Rooms */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
          <Hash size={18} className="mr-2" />
          Rooms
        </h2>
        <ul className="space-y-1">
          {rooms.map((r) => (
            <li key={r}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRoomChange(r)}
                className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 flex items-center justify-between ${
                  currentRoom === r
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <Hash size={14} className="mr-2" />
                  {r}
                </span>
                {unreadCount > 0 && r === currentRoom && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Online Users */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
          <Users size={18} className="mr-2" />
          Online Users
          <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
            {users.length}
          </span>
        </h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <motion.li 
              key={user.id} 
              whileHover={{ x: 5 }}
              className="flex items-center text-gray-300 p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-3"></span>
              <span className="truncate">{user.username}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      
      {/* Typing Users */}
      {typingUsers.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
            <Search size={14} className="mr-2" />
            Typing...
          </h2>
          <ul className="space-y-1">
            {typingUsers.map((user, index) => (
              <li key={index} className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">•</span>
                {user}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;