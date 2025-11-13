// components/Notification.jsx - Notification component with Framer Motion

import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const IconComponent = getTypeIcon(notification.type || 'info');

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="rounded-lg shadow-lg p-4 text-white max-w-sm"
    >
      <div className={`rounded-lg shadow-lg p-4 text-white max-w-sm ${getTypeColor(notification.type || 'info')}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <IconComponent size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold">{notification.title || 'Notification'}</h4>
              <p className="mt-1 text-sm">{notification.body || notification.message}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-2 text-xs opacity-75">
          {new Date(notification.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;