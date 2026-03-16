/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Divider/Divider.jsx
// DESKRIPSI: Divider component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';

const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  color = 'gray',
  text,
  textPosition = 'center',
  className = '',
  ...props
}) => {
  // Thickness styles
  const thicknesses = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1'
  };

  // Variant styles
  const variants = {
    solid: 'bg-current',
    dashed: 'border-current border-dashed',
    dotted: 'border-current border-dotted'
  };

  // Color styles
  const colors = {
    gray: 'text-gray-200',
    primary: 'text-primary-200',
    secondary: 'text-gray-300',
    white: 'text-white opacity-20'
  };

  // Text position for horizontal divider
  const textPositions = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  if (text && orientation === 'horizontal') {
    return (
      <div className={`flex items-center ${textPositions[textPosition]} w-full ${className}`} {...props}>
        <div className={`flex-1 ${thicknesses[thickness]} ${variants[variant]} ${colors[color]}`} />
        <span className="mx-4 text-sm text-gray-500 whitespace-nowrap">{text}</span>
        <div className={`flex-1 ${thicknesses[thickness]} ${variants[variant]} ${colors[color]}`} />
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={`
          ${thicknesses.medium}
          ${variants[variant]}
          ${colors[color]}
          ${className}
        `}
        {...props}
      />
    );
  }

  return (
    <div
      className={`
        ${thicknesses[thickness]}
        ${variants[variant]}
        ${colors[color]}
        w-full
        ${className}
      `}
      {...props}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['solid', 'dashed', 'dotted']),
  thickness: PropTypes.oneOf(['thin', 'medium', 'thick']),
  color: PropTypes.oneOf(['gray', 'primary', 'secondary', 'white']),
  text: PropTypes.string,
  textPosition: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string
};

export default Divider;