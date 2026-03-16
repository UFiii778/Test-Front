/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/AppointmentCard/AppointmentCard.jsx
// DESKRIPSI: Appointment card component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  BuildingOfficeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';

import { Card, Badge, Button, Typography } from '../../atoms';
import { formatDate, formatTime } from '../../../utils/dateFormatter';

const AppointmentCard = ({ 
  appointment, 
  onCancel, 
  onReschedule, 
  onConfirm,
  className = '',
  ...props 
}) => {
  // Get status config
  const getStatusConfig = (status) => {
    const configs = {
      menunggu: {
        label: 'Menunggu Konfirmasi',
        variant: 'warning',
        icon: PendingIcon
      },
      dikonfirmasi: {
        label: 'Dikonfirmasi',
        variant: 'success',
        icon: CheckCircleIcon
      },
      selesai: {
        label: 'Selesai',
        variant: 'info',
        icon: CheckCircleIcon
      },
      dibatalkan: {
        label: 'Dibatalkan',
        variant: 'danger',
        icon: XCircleIcon
      }
    };
    return configs[status] || configs.menunggu;
  };

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  const formattedDate = formatDate(appointment.appointment_date);
  const formattedTime = formatTime(appointment.appointment_time);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`overflow-hidden ${className}`} {...props}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${appointment.status === 'dikonfirmasi' ? 'bg-green-100' :
                appointment.status === 'menunggu' ? 'bg-yellow-100' :
                appointment.status === 'selesai' ? 'bg-blue-100' :
                'bg-gray-100'}
            `}>
              <CalendarIcon className={`
                w-6 h-6
                ${appointment.status === 'dikonfirmasi' ? 'text-green-600' :
                  appointment.status === 'menunggu' ? 'text-yellow-600' :
                  appointment.status === 'selesai' ? 'text-blue-600' :
                  'text-gray-600'}
              `} />
            </div>
            <div>
              <Typography variant="h6" className="mb-1">
                Janji Temu Donor
              </Typography>
              <Badge 
                variant={statusConfig.variant}
                size="sm"
                icon={StatusIcon}
                iconPosition="left"
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
          <Typography variant="caption" color="secondary">
            #{appointment.appointment_code}
          </Typography>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-3 flex-shrink-0" />
            <Typography variant="body2" color="secondary">
              {formattedDate}
            </Typography>
          </div>

          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-3 flex-shrink-0" />
            <Typography variant="body2" color="secondary">
              {formattedTime} WIB
            </Typography>
          </div>

          <div className="flex items-center text-gray-600">
            <BuildingOfficeIcon className="w-4 h-4 mr-3 flex-shrink-0" />
            <Typography variant="body2" color="secondary">
              {appointment.hospital_name}
            </Typography>
          </div>

          {appointment.doctor_name && (
            <div className="flex items-center text-gray-600">
              <UserIcon className="w-4 h-4 mr-3 flex-shrink-0" />
              <Typography variant="body2" color="secondary">
                Dr. {appointment.doctor_name}
              </Typography>
            </div>
          )}
        </div>

        {appointment.purpose && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Typography variant="caption" color="secondary">
              {appointment.purpose}
            </Typography>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {appointment.status === 'menunggu' && onConfirm && (
            <Button 
              variant="success" 
              size="sm"
              className="flex-1"
              onClick={() => onConfirm(appointment.id)}
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Konfirmasi
            </Button>
          )}

          {appointment.status === 'menunggu' && onCancel && (
            <Button 
              variant="danger" 
              size="sm"
              className="flex-1"
              onClick={() => onCancel(appointment.id)}
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              Batalkan
            </Button>
          )}

          {(appointment.status === 'menunggu' || appointment.status === 'dikonfirmasi') && onReschedule && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onReschedule(appointment.id)}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Jadwal Ulang
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    appointment_code: PropTypes.string,
    appointment_date: PropTypes.string.isRequired,
    appointment_time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    hospital_name: PropTypes.string.isRequired,
    doctor_name: PropTypes.string,
    purpose: PropTypes.string,
    notes: PropTypes.string
  }).isRequired,
  onCancel: PropTypes.func,
  onReschedule: PropTypes.func,
  onConfirm: PropTypes.func,
  className: PropTypes.string
};

export default AppointmentCard;