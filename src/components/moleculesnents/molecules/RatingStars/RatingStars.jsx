/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/RatingStars/RatingStars.jsx
// DESKRIPSI: Rating stars component
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import { Typography } from '../../atoms';

const RatingStars = ({
  value = 0,
  total = 5,
  size = 'md',
  editable = false,
  onChange,
  showValue = false,
  showLabel = false,
  precision = 1,
  readOnly = false,
  className = '',
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  // Size classes
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Label mapping
  const ratingLabels = {
    0: 'Belum ada rating',
    1: 'Sangat Buruk',
    2: 'Buruk',
    3: 'Cukup',
    4: 'Baik',
    5: 'Sangat Baik'
  };

  const displayValue = hoverValue !== null ? hoverValue : value;
  const fullStars = Math.floor(displayValue);
  const hasHalfStar = precision === 0.5 && displayValue % 1 !== 0;

  const handleMouseEnter = (index) => {
    if (editable && !readOnly) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (editable && !readOnly) {
      setHoverValue(null);
    }
  };

  const handleClick = (index) => {
    if (editable && !readOnly && onChange) {
      onChange(index);
    }
  };

  const handleHalfStarClick = (index) => {
    if (editable && !readOnly && onChange && precision === 0.5) {
      const newValue = Math.floor(value) === index - 1 ? index - 0.5 : index - 0.5;
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} {...props}>
      <div className="flex items-center space-x-1">
        {[...Array(total)].map((_, i) => {
          const starIndex = i + 1;
          const isActive = starIndex <= fullStars;
          const isHalfActive = hasHalfStar && starIndex === fullStars + 1;

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Half star (left side) */}
              {precision === 0.5 && (
                <div
                  className="absolute inset-0 w-1/2 overflow-hidden cursor-pointer"
                  onClick={() => handleHalfStarClick(starIndex)}
                  onMouseEnter={() => handleMouseEnter(starIndex - 0.5)}
                >
                  <StarSolid
                    className={`
                      ${sizes[size]}
                      ${isHalfActive ? 'text-yellow-400' : 'text-gray-300'}
                      transition-colors duration-200
                    `}
                  />
                </div>
              )}

              {/* Full star */}
              <motion.div
                whileHover={editable && !readOnly ? { scale: 1.1 } : {}}
                whileTap={editable && !readOnly ? { scale: 0.9 } : {}}
                onClick={() => handleClick(starIndex)}
              >
                {isActive || isHalfActive ? (
                  <StarSolid
                    className={`
                      ${sizes[size]}
                      text-yellow-400
                      transition-colors duration-200
                      ${editable && !readOnly ? 'cursor-pointer' : ''}
                    `}
                  />
                ) : (
                  <StarOutline
                    className={`
                      ${sizes[size]}
                      text-gray-300
                      transition-colors duration-200
                      ${editable && !readOnly ? 'cursor-pointer hover:text-yellow-400' : ''}
                    `}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Rating value */}
      {showValue && (
        <Typography variant="body2" weight="medium" className="ml-2">
          {value.toFixed(1)}
        </Typography>
      )}

      {/* Rating label */}
      {showLabel && ratingLabels[Math.round(value)] && (
        <Typography variant="body2" color="secondary" className="ml-2">
          {ratingLabels[Math.round(value)]}
        </Typography>
      )}
    </div>
  );
};

RatingStars.propTypes = {
  value: PropTypes.number,
  total: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  showValue: PropTypes.bool,
  showLabel: PropTypes.bool,
  precision: PropTypes.oneOf([1, 0.5]),
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

export default RatingStars;