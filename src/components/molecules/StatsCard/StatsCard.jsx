/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/StatsCard/StatsCard.jsx
// DESKRIPSI: Statistics card component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

import { Card, Typography } from '../../atoms';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  trendValue,
  trendLabel,
  className = '',
  ...props
}) => {
  // Color configurations
  const colors = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      text: 'text-primary-700'
    },
    success: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-700'
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-700'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-700'
    }
  };

  const colorConfig = colors[color] || colors.primary;

  // Format value if it's a number
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('id-ID') 
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden ${className}`} {...props}>
        <div className="flex items-start justify-between">
          <div>
            <Typography variant="body2" color="secondary" className="mb-1">
              {title}
            </Typography>
            <Typography variant="h3" weight="bold" className={colorConfig.text}>
              {formattedValue}
            </Typography>
          </div>
          
          {Icon && (
            <div className={`${colorConfig.bg} p-3 rounded-xl`}>
              <Icon className={`w-6 h-6 ${colorConfig.icon}`} />
            </div>
          )}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="mt-4 flex items-center space-x-2">
            {trend === 'up' ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
            ) : trend === 'down' ? (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
            ) : null}
            
            {trendValue && (
              <Typography variant="caption" weight="medium">
                <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {trendValue}
                </span>
              </Typography>
            )}
            
            {trendLabel && (
              <Typography variant="caption" color="secondary">
                {trendLabel}
              </Typography>
            )}
          </div>
        )}

        {/* Progress bar (optional) */}
        {props.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <Typography variant="caption" color="secondary">
                Progress
              </Typography>
              <Typography variant="caption" weight="medium">
                {props.progress}%
              </Typography>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${colorConfig.bg} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${props.progress}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'purple']),
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.string,
  trendLabel: PropTypes.string,
  progress: PropTypes.number,
  className: PropTypes.string
};

export default StatsCard;