/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/atoms/Input/Input.jsx
// DESKRIPSI: Input component with variants
// =====================================================

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  readOnly = false,
  icon: Icon,
  iconPosition = 'left',
  helperText,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  // Input variants
  const inputVariants = {
    default: 'border-gray-200 focus:border-primary-400 focus:ring-primary-100',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-100',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-100'
  };

  // Animation variants
  const animationVariants = {
    focus: { scale: 1.01 },
    blur: { scale: 1 }
  };

  const inputState = error ? 'error' : success ? 'success' : 'default';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          whileFocus="focus"
          variants={animationVariants}
          className={`
            w-full px-4 py-3 rounded-xl border-2 outline-none
            transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            read-only:bg-gray-50
            ${inputVariants[inputState]}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  helperText: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string
};

export default Input;