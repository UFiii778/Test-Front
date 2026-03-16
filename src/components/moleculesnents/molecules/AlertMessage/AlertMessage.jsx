/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/AlertMessage/AlertMessage.jsx
// DESKRIPSI: Alert message component
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { Typography } from '../../atoms';

const AlertMessage = ({
  type = 'info',
  title,
  message,
  dismissible = true,
  autoClose = false,
  autoCloseTime = 5000,
  onClose,
  className = '',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Type configurations
  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  // Auto close
  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            ${config.bg}
            ${config.border}
            border rounded-xl p-4
            ${className}
          `}
          {...props}
        >
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>

            {/* Content */}
            <div className="ml-3 flex-1">
              {title && (
                <Typography 
                  variant="body2" 
                  weight="semibold" 
                  className={config.titleColor}
                >
                  {title}
                </Typography>
              )}
              
              {message && (
                <Typography 
                  variant="body2" 
                  className={`${config.messageColor} ${title ? 'mt-1' : ''}`}
                >
                  {message}
                </Typography>
              )}

              {children}
            </div>

            {/* Close button */}
            {dismissible && (
              <button
                onClick={handleClose}
                className={`
                  flex-shrink-0 ml-4
                  ${config.iconColor} hover:opacity-75
                  transition-opacity
                `}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  dismissible: PropTypes.bool,
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes.number,
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

export default AlertMessage;