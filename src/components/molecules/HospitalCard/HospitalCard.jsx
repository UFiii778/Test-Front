/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/HospitalCard/HospitalCard.jsx
// DESKRIPSI: Hospital card component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  TruckIcon,
  HeartIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

import { Card, Badge, Button, Typography } from '../../atoms';

const HospitalCard = ({ 
  hospital, 
  showDistance = false, 
  showBloodStock = true,
  onSelect,
  className = '', 
  ...props 
}) => {
  // Get stock status color
  const getStockStatusColor = (status) => {
    switch (status) {
      case 'kritis': return 'danger';
      case 'waspada': return 'warning';
      case 'aman': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className={`overflow-hidden ${className}`} {...props}>
        {/* Image */}
        {hospital.image_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={hospital.image_url}
              alt={hospital.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            {hospital.has_emergency && (
              <div className="absolute top-2 right-2">
                <Badge variant="danger" size="sm" icon={HeartIcon}>
                  UGD
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <BuildingOfficeIcon className="w-16 h-16 text-primary-400" />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Name and verification */}
          <div className="flex items-start justify-between mb-2">
            <Typography variant="h6" className="line-clamp-1 flex-1">
              {hospital.name}
            </Typography>
            {hospital.is_verified && (
              <CheckBadgeIcon className="w-5 h-5 text-primary-600 flex-shrink-0 ml-2" title="Terverifikasi" />
            )}
          </div>

          {/* Address */}
          <div className="flex items-start text-gray-600 mb-2">
            <MapPinIcon className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <Typography variant="body2" color="secondary" className="line-clamp-2">
              {hospital.address}
            </Typography>
          </div>

          {/* Contact and hours */}
          <div className="space-y-1 mb-3">
            {hospital.phone && (
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <Typography variant="caption" color="secondary">
                  {hospital.phone}
                </Typography>
              </div>
            )}

            {hospital.operating_hours && (
              <div className="flex items-center text-gray-600">
                <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <Typography variant="caption" color="secondary">
                  {hospital.operating_hours}
                </Typography>
              </div>
            )}

            {showDistance && hospital.distance && (
              <div className="flex items-center text-gray-600">
                <TruckIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <Typography variant="caption" color="secondary">
                  {hospital.distance} km dari lokasi Anda
                </Typography>
              </div>
            )}
          </div>

          {/* Facilities */}
          {hospital.facilities && hospital.facilities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {hospital.facilities.slice(0, 3).map((facility, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {facility}
                  </Badge>
                ))}
                {hospital.facilities.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{hospital.facilities.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Blood stock summary */}
          {showBloodStock && hospital.blood_stock && hospital.blood_stock.length > 0 && (
            <div className="mb-4">
              <Typography variant="caption" weight="semibold" className="mb-2 block text-gray-700">
                Stok Darah Tersedia:
              </Typography>
              <div className="grid grid-cols-4 gap-1">
                {hospital.blood_stock.slice(0, 4).map((stock) => (
                  <div 
                    key={stock.blood_type} 
                    className="text-center p-1 rounded-lg bg-gray-50"
                    title={`${stock.blood_type}: ${stock.quantity} kantong`}
                  >
                    <Typography variant="caption" weight="bold" className="block">
                      {stock.blood_type}
                    </Typography>
                    <Badge 
                      variant={getStockStatusColor(stock.status)}
                      size="sm"
                      className="mt-1"
                    >
                      {stock.quantity}
                    </Badge>
                  </div>
                ))}
              </div>
              {hospital.blood_stock.length > 4 && (
                <Typography variant="caption" color="secondary" className="mt-1 block text-center">
                  +{hospital.blood_stock.length - 4} golongan lainnya
                </Typography>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link to={`/hospitals/${hospital.id}`} className="flex-1">
              <Button variant="primary" size="sm" fullWidth>
                Detail
              </Button>
            </Link>
            
            {hospital.phone && (
              <a
                href={`tel:${hospital.phone}`}
                className="flex-shrink-0"
              >
                <Button variant="outline" size="sm">
                  <PhoneIcon className="w-4 h-4" />
                </Button>
              </a>
            )}

            {onSelect && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelect(hospital)}
                className="flex-shrink-0"
              >
                Pilih
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

HospitalCard.propTypes = {
  hospital: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string,
    province: PropTypes.string,
    phone: PropTypes.string,
    emergency_phone: PropTypes.string,
    operating_hours: PropTypes.string,
    facilities: PropTypes.arrayOf(PropTypes.string),
    image_url: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    distance: PropTypes.number,
    is_verified: PropTypes.bool,
    has_emergency: PropTypes.bool,
    blood_stock: PropTypes.arrayOf(
      PropTypes.shape({
        blood_type: PropTypes.string,
        quantity: PropTypes.number,
        status: PropTypes.string
      })
    )
  }).isRequired,
  showDistance: PropTypes.bool,
  showBloodStock: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string
};

export default HospitalCard;