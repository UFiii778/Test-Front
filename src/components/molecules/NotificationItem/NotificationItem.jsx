/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/NotificationItem/NotificationItem.jsx
// DESKRIPSI: Notification item component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  BellIcon,
  HeartIcon,
  CalendarIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Avatar, Badge, Typography } from '../../atoms';
import { formatDistanceToNow } from '../../../utils/dateFormatter';

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onClick,
  onDelete,
  className = '',
  ...props
}) => {
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'permintaan':
        return HeartIcon;
      case 'respon':
        return CheckCircleIcon;
      case 'pengingat':
        return CalendarIcon;
      case 'info':
        return InformationCircleIcon;
      case 'darurat':
        return ExclamationTriangleIcon;
      case 'sistem':
        return DocumentTextIcon;
      case 'chat':
        return ChatBubbleLeftRightIcon;
      case 'user':
        return UserGroupIcon;
      default:
        return BellIcon;
    }
  };

  // Get background color based on read status and type
  const getBackgroundColor = () => {
    if (!notification.is_read) {
      if (notification.type === 'darurat') {
        return 'bg-red-50 hover:bg-red-100';
      }
      return 'bg-primary-50 hover:bg-primary-100';
    }
    return 'hover:bg-gray-50';
  };

  // Get icon background color
  const getIconBgColor = () => {
    if (!notification.is_read) {
      if (notification.type === 'darurat') {
        return 'bg-red-100';
      }
      return 'bg-primary-100';
    }
    return 'bg-gray-100';
  };

  // Get icon color
  const getIconColor = () => {
    if (!notification.is_read) {
      if (notification.type === 'darurat') {
        return 'text-red-600';
      }
      return 'text-primary-600';
    }
    return 'text-gray-600';
  };

  const Icon = getIcon();
  const timeAgo = formatDistanceToNow(notification.created_at);

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`
        p-4 cursor-pointer transition-all duration-200
        border-b border-gray-100 last:border-b-0
        ${getBackgroundColor()}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full 
          flex items-center justify-center
          ${getIconBgColor()}
        `}>
          <Icon className={`w-5 h-5 ${getIconColor()}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Typography 
              variant="body2" 
              weight={!notification.is_read ? 'semibold' : 'normal'}
              className="mb-1"
            >
              {notification.title}
            </Typography>
            
            {!notification.is_read && (
              <Badge size="sm" variant="primary" className="ml-2">
                Baru
              </Badge>
            )}
          </div>
          
          <Typography 
            variant="body2" 
            color="secondary" 
            className="mb-2 line-clamp-2"
          >
            {notification.message}
          </Typography>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{timeAgo}</span>
              
              {notification.data?.sender && (
                <>
                  <span>•</span>
                  <span className="text-primary-600">
                    {notification.data.sender}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {!notification.is_read && onMarkAsRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded transition-colors"
                  title="Tandai sudah dibaca"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Hapus notifikasi"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Image preview if available */}
        {notification.data?.image && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
            <img 
              src={notification.data.image} 
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Action buttons for specific notification types */}
      {notification.data?.actions && (
        <div className="mt-3 flex items-center space-x-2 pl-13">
          {notification.data.actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.handler?.();
              }}
              className="px-3 py-1 text-xs font-medium rounded-lg
                bg-white border border-gray-300 text-gray-700
                hover:bg-gray-50 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    is_read: PropTypes.bool,
    created_at: PropTypes.string.isRequired,
    data: PropTypes.shape({
      sender: PropTypes.string,
      image: PropTypes.string,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          handler: PropTypes.func
        })
      )
    })
  }).isRequired,
  onMarkAsRead: PropTypes.func,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string
};

export default NotificationItem;