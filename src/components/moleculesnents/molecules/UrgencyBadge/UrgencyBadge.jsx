/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/UrgencyBadge/UrgencyBadge.jsx
// DESKRIPSI: Urgency badge component for donation requests
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  ExclamationTriangleIcon,
  FireIcon 
} from '@heroicons/react/24/outline';

import { Badge } from '../../atoms';

const UrgencyBadge = ({ 
  urgency, 
  size = 'md',
  showIcon = true,
  pulsate = false,
  className = '',
  ...props 
}) => {
  // Urgency configurations
  const urgencyConfig = {
    biasa: {
      label: 'Biasa',
      variant: 'info',
      icon: ClockIcon,
      description: 'Permintaan biasa, dapat dipenuhi dalam waktu 3 hari',
      color: 'bg-blue-100 text-blue-800'
    },
    urgent: {
      label: 'Urgent',
      variant: 'warning',
      icon: ExclamationTriangleIcon,
      description: 'Permintaan mendesak, dibutuhkan dalam 24 jam',
      color: 'bg-yellow-100 text-yellow-800'
    },
    gawat_darurat: {
      label: 'Gawat Darurat',
      variant: 'danger',
      icon: FireIcon,
      description: 'Darurat, dibutuhkan segera!',
      color: 'bg-red-100 text-red-800 animate-pulse'
    }
  };

  const config = urgencyConfig[urgency] || urgencyConfig.biasa;

  // Animation for pulsating effect
  const pulseAnimation = pulsate ? {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <motion.div
      animate={pulseAnimation}
      className={`inline-flex items-center ${className}`}
      title={config.description}
      {...props}
    >
      <Badge
        variant={config.variant}
        size={size}
        icon={showIcon ? config.icon : null}
        iconPosition="left"
        className={config.color}
      >
        {config.label}
      </Badge>
    </motion.div>
  );
};

UrgencyBadge.propTypes = {
  urgency: PropTypes.oneOf(['biasa', 'urgent', 'gawat_darurat']).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
  pulsate: PropTypes.bool,
  className: PropTypes.string
};

export default UrgencyBadge;