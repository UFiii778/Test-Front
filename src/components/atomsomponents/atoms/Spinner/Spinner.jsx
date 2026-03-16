/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Spinner/Spinner.jsx
// DESKRIPSI: Spinner component for loading states
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Spinner = ({
  size = 'md',
  color = 'primary',
  variant = 'border',
  className = '',
  ...props
}) => {
  // Size mapping
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  // Color classes
  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  // Variant styles
  const variants = {
    border: 'border-4 border-t-transparent rounded-full animate-spin',
    grow: 'animate-ping',
    dots: 'flex space-x-1',
    pulse: 'animate-pulse'
  };

  // Border variant spinner
  const BorderSpinner = () => (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        ${variants.border}
        border-current
        ${className}
      `}
      {...props}
    />
  );

  // Grow variant spinner
  const GrowSpinner = () => (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        ${variants.grow}
        bg-current rounded-full
        ${className}
      `}
      {...props}
    />
  );

  // Dots variant spinner
  const DotsSpinner = () => (
    <div className={`flex space-x-1 ${className}`} {...props}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`
            ${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}
            ${colors[color]}
            bg-current rounded-full
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );

  // Pulse variant spinner
  const PulseSpinner = () => (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        ${variants.pulse}
        bg-current rounded-full
        ${className}
      `}
      {...props}
    />
  );

  // Render appropriate variant
  switch (variant) {
    case 'border':
      return <BorderSpinner />;
    case 'grow':
      return <GrowSpinner />;
    case 'dots':
      return <DotsSpinner />;
    case 'pulse':
      return <PulseSpinner />;
    default:
      return <BorderSpinner />;
  }
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray', 'success', 'warning', 'danger']),
  variant: PropTypes.oneOf(['border', 'grow', 'dots', 'pulse']),
  className: PropTypes.string
};

export default Spinner;