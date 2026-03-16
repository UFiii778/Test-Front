/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Avatar/Avatar.jsx
// DESKRIPSI: Avatar component for user profiles
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  border = false,
  status,
  statusPosition = 'bottom-right',
  onClick,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };

  // Shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    rounded: 'rounded-md'
  };

  // Status position classes
  const statusPositions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  // Status color classes
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={`
        relative inline-flex
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Avatar content */}
      <div
        className={`
          ${sizes[size]}
          ${shapeClasses[shape]}
          bg-gray-200 flex items-center justify-center
          overflow-hidden
          ${border ? 'ring-2 ring-primary-600 ring-offset-2' : ''}
        `}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className="font-medium text-gray-600">
            {getInitials()}
          </span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute ${statusPositions[statusPosition]}
            w-2.5 h-2.5 rounded-full
            ${statusColors[status]}
            ring-2 ring-white
          `}
        />
      )}
    </motion.div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
  border: PropTypes.bool,
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  statusPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Avatar;