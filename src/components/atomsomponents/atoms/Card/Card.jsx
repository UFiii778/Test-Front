/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Card/Card.jsx
// DESKRIPSI: Card component with variants
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  border = true,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  // Variant styles
  const variants = {
    default: 'bg-white',
    primary: 'bg-primary-50',
    secondary: 'bg-gray-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
    gradient: 'bg-gradient-to-br from-primary-50 to-white',
    glass: 'glass'
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  // Shadow styles
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  // Border styles
  const borderStyles = border ? 'border border-gray-200' : '';

  // Animation variants
  const animationVariants = {
    hover: hoverable ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {},
    tap: clickable ? { scale: 0.98 } : {}
  };

  return (
    <motion.div
      whileHover={animationVariants.hover}
      whileTap={animationVariants.tap}
      className={`
        ${variants[variant]}
        ${paddings[padding]}
        ${shadows[shadow]}
        ${borderStyles}
        rounded-2xl
        transition-all duration-200
        ${clickable || onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success',
    'warning', 'danger', 'info', 'gradient', 'glass'
  ]),
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  border: PropTypes.bool,
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Card;