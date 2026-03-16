/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/Tabs/Tabs.jsx
// DESKRIPSI: Tabs component
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const Tabs = ({
  tabs,
  defaultActiveKey,
  activeKey,
  onChange,
  variant = 'underline',
  size = 'md',
  centered = false,
  className = '',
  tabClassName = '',
  contentClassName = '',
  ...props
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || tabs[0]?.key);

  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

  // Size classes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variants = {
    underline: {
      tab: 'border-b-2 transition-colors',
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    pill: {
      tab: 'rounded-xl transition-all',
      active: 'bg-primary-600 text-white',
      inactive: 'text-gray-600 hover:bg-gray-100'
    },
    button: {
      tab: 'rounded-lg border border-gray-200 transition-all',
      active: 'bg-primary-600 text-white border-primary-600',
      inactive: 'bg-white text-gray-600 hover:bg-gray-50'
    }
  };

  const handleTabClick = (key) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeTab = tabs.find(tab => tab.key === currentActiveKey);

  return (
    <div className={className} {...props}>
      {/* Tab headers */}
      <div className={`
        flex ${centered ? 'justify-center' : ''} 
        space-x-1 border-b border-gray-200
        ${variant === 'pill' ? 'border-b-0' : ''}
      `}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            disabled={tab.disabled}
            className={`
              ${sizes[size]}
              ${variants[variant].tab}
              ${currentActiveKey === tab.key 
                ? variants[variant].active 
                : variants[variant].inactive
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              font-medium focus:outline-none
              ${tabClassName}
            `}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && (
                <tab.icon className="w-5 h-5" />
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`
                  ml-2 px-2 py-0.5 text-xs rounded-full
                  ${currentActiveKey === tab.key 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-gray-200 text-gray-700'
                  }
                `}>
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActiveKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`mt-4 ${contentClassName}`}
        >
          {activeTab?.children || activeTab?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.elementType,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
      children: PropTypes.node,
      content: PropTypes.node
    })
  ).isRequired,
  defaultActiveKey: PropTypes.string,
  activeKey: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['underline', 'pill', 'button']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  centered: PropTypes.bool,
  className: PropTypes.string,
  tabClassName: PropTypes.string,
  contentClassName: PropTypes.string
};

export default Tabs;