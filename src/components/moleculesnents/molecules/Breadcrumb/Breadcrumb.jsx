/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/Breadcrumb/Breadcrumb.jsx
// DESKRIPSI: Breadcrumb navigation component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

import { Typography } from '../../atoms';

const Breadcrumb = ({ 
  items, 
  showHome = true,
  homePath = '/',
  separator = ChevronRightIcon,
  className = '',
  ...props 
}) => {
  const SeparatorIcon = separator;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} {...props}>
      {/* Home link */}
      {showHome && (
        <>
          <Link
            to={homePath}
            className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
          <SeparatorIcon className="w-4 h-4 text-gray-400" />
        </>
      )}

      {/* Breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.path || index}>
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                variant="body2"
                color={isLast ? 'primary' : 'secondary'}
                weight={isLast ? 'medium' : 'normal'}
              >
                {item.label}
              </Typography>
            )}
            
            {!isLast && (
              <SeparatorIcon className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ).isRequired,
  showHome: PropTypes.bool,
  homePath: PropTypes.string,
  separator: PropTypes.elementType,
  className: PropTypes.string
};

export default Breadcrumb;