// components/MessageList.jsx - Message list component with pagination

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedMessage from './AnimatedMessage';

const MessageList = ({ 
  messages, 
  currentUser, 
  onReact, 
  onMarkAsRead, 
  onLoadMore, 
  hasMoreMessages 
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isLoadingMore = useRef(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll for loading more messages
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore.current || !hasMoreMessages) return;

    // Check if user has scrolled to the top
    if (container.scrollTop === 0) {
      isLoadingMore.current = true;
      const firstMessage = messages[0];
      if (firstMessage) {
        onLoadMore(firstMessage.timestamp);
      }
    }
  };

  // Reset loading state when messages change
  useEffect(() => {
    isLoadingMore.current = false;
  }, [messages]);

  return (
    <div 
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      {hasMoreMessages && (
        <div className="text-center py-4">
          <button
            onClick={() => {
              const firstMessage = messages[0];
              if (firstMessage) {
                onLoadMore(firstMessage.timestamp);
              }
            }}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Load more messages...
          </button>
        </div>
      )}
      
      <AnimatePresence>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {messages.map((msg) => (
            <AnimatedMessage
              key={msg.id}
              message={msg}
              currentUser={currentUser}
              onReact={onReact}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
          <div ref={messagesEndRef} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MessageList;