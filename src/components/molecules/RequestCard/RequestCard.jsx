/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/RequestCard/RequestCard.jsx
// DESKRIPSI: Donation request card component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  ClockIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

import { Card, Badge, Button, Typography } from '../../atoms';
import UrgencyBadge from '../UrgencyBadge/UrgencyBadge';
import { formatDistanceToNow } from '../../../utils/dateFormatter';

const RequestCard = ({ request, onRespond, className = '', ...props }) => {
  const timeAgo = formatDistanceToNow(request.created_at);

  // Status configuration
  const statusConfig = {
    menunggu: { label: 'Menunggu', variant: 'warning' },
    diproses: { label: 'Diproses', variant: 'info' },
    selesai: { label: 'Selesai', variant: 'success' },
    dibatalkan: { label: 'Dibatalkan', variant: 'danger' }
  };

  const status = statusConfig[request.request_status] || statusConfig.menunggu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className={`overflow-hidden ${className}`} {...props}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="primary" size="lg" className="text-lg font-bold">
                {request.blood_type}
              </Badge>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <Typography variant="caption" color="secondary">
              Kode: {request.request_code || `REQ-${request.id}`}
            </Typography>
          </div>
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        </div>

        {/* Patient info */}
        <div className="space-y-2 mb-4">
          {request.patient_name && (
            <div className="flex items-center text-gray-600">
              <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <Typography variant="body2" color="secondary">
                {request.patient_name}
              </Typography>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <Typography variant="body2" color="secondary">
              {request.patient_city || request.location || 'Lokasi tidak diketahui'}
            </Typography>
          </div>

          {request.hospital_name && (
            <div className="flex items-center text-gray-600">
              <BuildingOfficeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <Typography variant="body2" color="secondary">
                {request.hospital_name}
              </Typography>
            </div>
          )}

          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <Typography variant="body2" color="secondary">
              {timeAgo}
            </Typography>
          </div>
        </div>

        {/* Notes */}
        {request.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Typography variant="caption" color="secondary" className="line-clamp-2">
              {request.notes}
            </Typography>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-gray-500">Kantong: </span>
              <span className="font-semibold text-gray-900">{request.quantity || 1}</span>
            </div>
            <div>
              <span className="text-gray-500">Respon: </span>
              <span className="font-semibold text-gray-900">{request.total_responses || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Tersedia: </span>
              <span className="font-semibold text-green-600">{request.available_responses || 0}</span>
            </div>
          </div>

          {request.distance && (
            <Badge variant="secondary" size="sm">
              {request.distance} km
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link to={`/requests/${request.id}`} className="flex-1">
            <Button variant="outline" size="sm" fullWidth>
              Detail
            </Button>
          </Link>
          
          {onRespond && request.request_status === 'menunggu' && (
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1"
              onClick={() => onRespond(request.id)}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Respon
            </Button>
          )}

          {request.request_status === 'menunggu' && request.is_owner && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => onRespond && onRespond(request.id, 'cancel')}
            >
              Batalkan
            </Button>
          )}
        </div>

        {/* Progress bar for emergency requests */}
        {request.urgency === 'gawat_darurat' && request.time_elapsed && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <Typography variant="caption" color="secondary">
                Waktu tunggu
              </Typography>
              <Typography variant="caption" weight="medium" className="text-red-600">
                {request.time_elapsed}
              </Typography>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${request.progress || 0}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    request_code: PropTypes.string,
    blood_type: PropTypes.string.isRequired,
    urgency: PropTypes.string.isRequired,
    request_status: PropTypes.string.isRequired,
    patient_name: PropTypes.string,
    patient_city: PropTypes.string,
    location: PropTypes.string,
    hospital_name: PropTypes.string,
    quantity: PropTypes.number,
    notes: PropTypes.string,
    total_responses: PropTypes.number,
    available_responses: PropTypes.number,
    created_at: PropTypes.string.isRequired,
    distance: PropTypes.number,
    is_owner: PropTypes.bool,
    time_elapsed: PropTypes.string,
    progress: PropTypes.number
  }).isRequired,
  onRespond: PropTypes.func,
  className: PropTypes.string
};

export default RequestCard;