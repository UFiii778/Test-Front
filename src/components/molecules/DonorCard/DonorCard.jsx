/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/DonorCard/DonorCard.jsx
// DESKRIPSI: Donor card component for displaying donor information
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  MapPinIcon, 
  HeartIcon,
  ClockIcon,
  CheckBadgeIcon,
  PhoneIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

import { Card, Avatar, Badge, Button, Typography } from '../../atoms';
import { formatDistanceToNow } from '../../../utils/dateFormatter';

const DonorCard = ({ 
  donor, 
  showContact = false,
  showDistance = false,
  onSelect,
  className = '',
  ...props 
}) => {
  const lastDonation = donor.last_donation_date 
    ? formatDistanceToNow(donor.last_donation_date)
    : 'Belum pernah donor';

  // Calculate donor status
  const getDonorStatus = () => {
    if (!donor.last_donation_date) {
      return { label: 'Siap Donor', variant: 'success' };
    }

    const lastDate = new Date(donor.last_donation_date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 90);
    const now = new Date();

    if (now >= nextDate) {
      return { label: 'Siap Donor', variant: 'success' };
    } else {
      const daysLeft = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
      return { label: `${daysLeft} hari lagi`, variant: 'warning' };
    }
  };

  const status = getDonorStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className={`overflow-hidden ${className}`} {...props}>
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <Avatar
            src={donor.profile_picture}
            name={donor.full_name}
            size="lg"
            status={status.label === 'Siap Donor' ? 'online' : 'away'}
          />

          {/* Donor info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Typography variant="h6" className="mb-1">
                  {donor.full_name}
                </Typography>
                <div className="flex items-center space-x-2">
                  <Badge variant="primary" size="sm">
                    {donor.blood_type}
                  </Badge>
                  <Badge variant={status.variant} size="sm">
                    {status.label}
                  </Badge>
                  {donor.is_verified && (
                    <Badge variant="success" size="sm" icon={CheckBadgeIcon}>
                      Terverifikasi
                    </Badge>
                  )}
                </div>
              </div>
              
              {showDistance && donor.distance && (
                <Badge variant="secondary" size="sm">
                  {donor.distance} km
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <Typography variant="caption" color="secondary">
                  Total Donor
                </Typography>
                <Typography variant="body2" weight="bold">
                  {donor.total_donations || 0}
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" color="secondary">
                  Terakhir
                </Typography>
                <Typography variant="body2" weight="bold">
                  {lastDonation}
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" color="secondary">
                  Respon
                </Typography>
                <Typography variant="body2" weight="bold">
                  {donor.response_rate || 0}%
                </Typography>
              </div>
            </div>

            {/* Location */}
            {donor.city && (
              <div className="flex items-center text-gray-600 mb-3">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <Typography variant="caption" color="secondary">
                  {donor.city}, {donor.province || ''}
                </Typography>
              </div>
            )}

            {/* Contact info (optional) */}
            {showContact && (
              <div className="space-y-2 mb-3">
                {donor.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    <Typography variant="caption" color="secondary">
                      {donor.phone}
                    </Typography>
                  </div>
                )}
                {donor.email && (
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    <Typography variant="caption" color="secondary">
                      {donor.email}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Action button */}
            {onSelect && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onSelect(donor)}
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Pilih Donor
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

DonorCard.propTypes = {
  donor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    full_name: PropTypes.string.isRequired,
    blood_type: PropTypes.string,
    profile_picture: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    total_donations: PropTypes.number,
    last_donation_date: PropTypes.string,
    is_verified: PropTypes.bool,
    distance: PropTypes.number,
    response_rate: PropTypes.number
  }).isRequired,
  showContact: PropTypes.bool,
  showDistance: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string
};

export default DonorCard;