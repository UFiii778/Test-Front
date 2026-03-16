/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/atoms/Typography/Typography.jsx
// DESKRIPSI: Typography component with variants
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';

const Typography = ({
  children,
  variant = 'body1',
  component: Component,
  color = 'default',
  align = 'left',
  weight = 'normal',
  className = '',
  ...props
}) => {
  // Variant mapping
  const variants = {
    h1: { tag: 'h1', classes: 'text-4xl md:text-5xl lg:text-6xl font-bold' },
    h2: { tag: 'h2', classes: 'text-3xl md:text-4xl font-bold' },
    h3: { tag: 'h3', classes: 'text-2xl md:text-3xl font-bold' },
    h4: { tag: 'h4', classes: 'text-xl md:text-2xl font-bold' },
    h5: { tag: 'h5', classes: 'text-lg md:text-xl font-bold' },
    h6: { tag: 'h6', classes: 'text-base md:text-lg font-bold' },
    subtitle1: { tag: 'h6', classes: 'text-lg md:text-xl' },
    subtitle2: { tag: 'h6', classes: 'text-base md:text-lg' },
    body1: { tag: 'p', classes: 'text-base' },
    body2: { tag: 'p', classes: 'text-sm' },
    caption: { tag: 'span', classes: 'text-xs' },
    overline: { tag: 'span', classes: 'text-xs uppercase tracking-wider' }
  };

  // Color variants
  const colors = {
    default: 'text-gray-900',
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    white: 'text-white',
    muted: 'text-gray-500'
  };

  // Alignment classes
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // Font weights
  const weights = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const variantConfig = variants[variant] || variants.body1;
  const Tag = Component || variantConfig.tag;

  return (
    <Tag
      className={`
        ${variantConfig.classes}
        ${colors[color]}
        ${alignments[align]}
        ${weights[weight]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};

Typography.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2',
    'body1', 'body2',
    'caption', 'overline'
  ]),
  component: PropTypes.elementType,
  color: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success',
    'warning', 'danger', 'info', 'white', 'muted'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  weight: PropTypes.oneOf([
    'thin', 'light', 'normal', 'medium',
    'semibold', 'bold', 'extrabold'
  ]),
  className: PropTypes.string
};

export default Typography;