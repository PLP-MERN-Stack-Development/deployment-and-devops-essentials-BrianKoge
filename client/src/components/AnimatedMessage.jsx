// components/AnimatedMessage.jsx - Animated message component with Framer Motion

import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Heart, Laugh, Meh, Frown, Angry } from 'lucide-react';

const AnimatedMessage = ({ message, currentUser, onReact, onMarkAsRead }) => {
  const isCurrentUser = message.sender === currentUser;
  const isPrivate = message.isPrivate;
  const isSystem = message.system;
  
  // Mark as read when message is rendered (for non-sender messages)
  React.useEffect(() => {
    if (!isCurrentUser && !message.readBy?.includes(currentUser)) {
      onMarkAsRead(message.id);
    }
  }, [message.id, isCurrentUser, message.readBy, currentUser, onMarkAsRead]);

  // Check if current user has reacted with a specific emoji
  const hasUserReacted = (emoji) => {
    return message.reactions?.[emoji]?.includes(currentUser) || false;
  };

  // Get reaction count for an emoji
  const getReactionCount = (emoji) => {
    return message.reactions?.[emoji]?.length || 0;
  };

  // Get all reactions for the message
  const getAllReactions = () => {
    if (!message.reactions) return [];
    return Object.entries(message.reactions).map(([emoji, users]) => ({
      emoji,
      count: users.length,
      users
    }));
  };

  // Map emojis to Lucide icons
  const emojiIcons = {
    '👍': ThumbsUp,
    '❤️': Heart,
    '😂': Laugh,
    '😮': Meh,
    '😢': Frown,
    '😡': Angry
  };

  // Common reactions
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl max-w-3/4 ${
        isSystem 
          ? 'bg-gray-700 text-center mx-auto' 
          : isPrivate 
            ? 'bg-gradient-to-r from-purple-900 to-indigo-900 ml-auto' 
            : isCurrentUser
              ? 'bg-gradient-to-r from-blue-700 to-blue-800 ml-auto'
              : 'bg-gray-700'
      }`}
    >
      {!isSystem && (
        <div className="font-semibold flex items-center justify-between">
          <span className={isCurrentUser ? 'text-blue-300' : 'text-purple-300'}>
            {message.sender}
          </span>
          {isPrivate && (
            <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
              Private
            </span>
          )}
        </div>
      )}
      
      <div className="text-white mt-1 break-words">{message.message}</div>
      
      {/* Reactions */}
      {getAllReactions().length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {getAllReactions().map((reaction) => {
            const IconComponent = emojiIcons[reaction.emoji] || null;
            return (
              <motion.button
                key={reaction.emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReact(message.id, reaction.emoji)}
                className={`flex items-center text-sm px-2 py-1 rounded-full ${
                  hasUserReacted(reaction.emoji)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {IconComponent ? (
                  <IconComponent size={14} className="mr-1" />
                ) : (
                  <span className="mr-1">{reaction.emoji}</span>
                )}
                <span>{reaction.count}</span>
              </motion.button>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Read receipts */}
        {isCurrentUser && message.readBy && message.readBy.length > 1 && (
          <div className="text-xs text-gray-400">
            Read by {message.readBy.length - 1} user{message.readBy.length - 1 > 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {/* Reaction buttons */}
      {!isSystem && (
        <div className="flex flex-wrap gap-1 mt-2">
          {commonReactions.map((emoji) => {
            const IconComponent = emojiIcons[emoji] || null;
            return (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReact(message.id, emoji)}
                className={`text-sm w-8 h-8 flex items-center justify-center rounded-full ${
                  hasUserReacted(emoji)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {IconComponent ? (
                  <IconComponent size={16} />
                ) : (
                  emoji
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedMessage;