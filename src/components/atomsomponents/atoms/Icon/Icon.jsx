/* eslint-disable */
=====================================================
// FILE: frontend/src/components/atoms/Icon/Icon.jsx
// DESKRIPSI: Icon component wrapper
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

const Icon = ({
  name,
  variant = 'outline',
  size = 'md',
  color = 'currentColor',
  className = '',
  onClick,
  ...props
}) => {
  // Size mapping
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };

  // Select icon set based on variant
  const iconSet = variant === 'solid' ? SolidIcons : HeroIcons;
  const IconComponent = iconSet[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={`
        ${sizes[size]}
        ${className}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
      style={{ color }}
      onClick={onClick}
      {...props}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['outline', 'solid']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Icon;