/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Button/Button.jsx
// DESKRIPSI: Button component with variants
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Spinner from '../Spinner/Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  // Variant styles
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary-200',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg shadow-green-200',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-lg shadow-yellow-200',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    link: 'text-primary-600 hover:text-primary-700 underline underline-offset-2'
  };

  // Size styles
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };

  // Animation variants
  const animationVariants = {
    hover: { scale: disabled || loading ? 1 : 1.02 },
    tap: { scale: disabled || loading ? 1 : 0.98 }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={animationVariants}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        rounded-xl font-semibold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="w-5 h-5" />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success', 'warning', 'ghost', 'link']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default Button;