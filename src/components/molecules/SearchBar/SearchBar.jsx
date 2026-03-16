/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/SearchBar/SearchBar.jsx
// DESKRIPSI: Search bar component with filters
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

import { Input, Button, Badge } from '../../atoms';

const SearchBar = ({
  placeholder = 'Cari...',
  onSearch,
  onFilter,
  filters = [],
  showFilter = true,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm, activeFilters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    if (!value || value === '') {
      delete newFilters[filterName];
    }
    setActiveFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    if (onFilter) {
      onFilter({});
    }
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center space-x-2">
        {/* Search input */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            icon={MagnifyingGlassIcon}
            iconPosition="left"
          />
        </div>

        {/* Search button */}
        <Button onClick={handleSearch} variant="primary">
          Cari
        </Button>

        {/* Filter button */}
        {showFilter && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <FunnelIcon className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <Badge
                size="sm"
                variant="danger"
                className="absolute -top-2 -right-2"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Filter</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Hapus semua
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.name] || ''}
                      onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Semua</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'radio' && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={filter.name}
                            value={option.value}
                            checked={activeFilters[filter.name] === option.value}
                            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'checkbox' && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={activeFilters[filter.name]?.includes(option.value)}
                            onChange={(e) => {
                              const currentValues = activeFilters[filter.name] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(v => v !== option.value);
                              handleFilterChange(filter.name, newValues);
                            }}
                            className="text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={filter.min || 0}
                        max={filter.max || 100}
                        value={activeFilters[filter.name] || filter.default || 0}
                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{filter.min || 0}</span>
                        <span>{activeFilters[filter.name] || filter.default || 0}</span>
                        <span>{filter.max || 100}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => {
                    const filter = filters.find(f => f.name === key);
                    if (!filter) return null;

                    let displayValue = value;
                    if (Array.isArray(value)) {
                      displayValue = value.join(', ');
                    }

                    return (
                      <Badge
                        key={key}
                        variant="primary"
                        removable
                        onRemove={() => handleFilterChange(key, '')}
                      >
                        {filter.label}: {displayValue}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['select', 'radio', 'checkbox', 'range']).isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      min: PropTypes.number,
      max: PropTypes.number,
      default: PropTypes.any
    })
  ),
  showFilter: PropTypes.bool,
  className: PropTypes.string
};

export default SearchBar;