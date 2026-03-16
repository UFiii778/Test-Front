/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/BloodTypeSelector/BloodTypeSelector.jsx
// DESKRIPSI: Blood type selector component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const BloodTypeSelector = ({
  value,
  onChange,
  includeRhesus = false,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const bloodTypes = ['A', 'B', 'AB', 'O'];
  const rhesusTypes = ['+', '-'];

  // Size classes
  const sizes = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  // Blood type color mapping
  const getBloodTypeColor = (type, rhesus, isSelected) => {
    const baseColors = {
      'A': {
        bg: 'bg-blue-100',
        hover: 'hover:bg-blue-200',
        selected: 'bg-blue-600',
        text: 'text-blue-800',
        selectedText: 'text-white'
      },
      'B': {
        bg: 'bg-green-100',
        hover: 'hover:bg-green-200',
        selected: 'bg-green-600',
        text: 'text-green-800',
        selectedText: 'text-white'
      },
      'AB': {
        bg: 'bg-purple-100',
        hover: 'hover:bg-purple-200',
        selected: 'bg-purple-600',
        text: 'text-purple-800',
        selectedText: 'text-white'
      },
      'O': {
        bg: 'bg-red-100',
        hover: 'hover:bg-red-200',
        selected: 'bg-red-600',
        text: 'text-red-800',
        selectedText: 'text-white'
      }
    };

    const color = baseColors[type];
    
    if (isSelected) {
      return `${color.selected} ${color.selectedText} ring-2 ring-primary-600 ring-offset-2`;
    }

    if (rhesus === '-') {
      return `${color.bg} ${color.hover} ${color.text} opacity-70`;
    }

    return `${color.bg} ${color.hover} ${color.text}`;
  };

  const handleSelect = (type, rhesus) => {
    if (disabled) return;
    
    const bloodType = includeRhesus ? `${type}${rhesus}` : type;
    onChange(bloodType);
  };

  const isSelected = (type, rhesus) => {
    if (includeRhesus) {
      return value === `${type}${rhesus}`;
    }
    return value === type;
  };

  if (includeRhesus) {
    return (
      <div className={`space-y-3 ${className}`} {...props}>
        {bloodTypes.map((type) => (
          <div key={type} className="flex items-center">
            <span className="w-8 font-bold text-gray-700">{type}</span>
            <div className="flex space-x-2">
              {rhesusTypes.map((rhesus) => (
                <motion.button
                  key={`${type}${rhesus}`}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  onClick={() => handleSelect(type, rhesus)}
                  disabled={disabled}
                  className={`
                    ${sizes[size]}
                    ${getBloodTypeColor(type, rhesus, isSelected(type, rhesus))}
                    rounded-xl font-bold
                    transition-all duration-200
                    flex items-center justify-center
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  title={`Golongan darah ${type}${rhesus}`}
                >
                  {type}{rhesus}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} {...props}>
      {bloodTypes.map((type) => (
        <motion.button
          key={type}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => handleSelect(type, '')}
          disabled={disabled}
          className={`
            ${sizes[size]}
            ${getBloodTypeColor(type, '+', isSelected(type, ''))}
            rounded-xl font-bold
            transition-all duration-200
            flex items-center justify-center
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={`Golongan darah ${type}`}
        >
          {type}
        </motion.button>
      ))}
    </div>
  );
};

BloodTypeSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  includeRhesus: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default BloodTypeSelector;