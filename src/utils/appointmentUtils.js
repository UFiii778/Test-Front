// =====================================================
// FILE: frontend/src/utils/appointmentUtils.js
// DESKRIPSI: Appointment utilities
// =====================================================

import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from './constants';

/**
 * Get appointment status label
 */
export const getAppointmentStatusLabel = (status) => {
  return APPOINTMENT_STATUS_LABELS[status] || status;
};

/**
 * Get appointment status color
 */
export const getAppointmentStatusColor = (status) => {
  const colors = {
    [APPOINTMENT_STATUS.MENUNGGU]: 'yellow',
    [APPOINTMENT_STATUS.DIKONFIRMASI]: 'green',
    [APPOINTMENT_STATUS.SELESAI]: 'blue',
    [APPOINTMENT_STATUS.DIBATALKAN]: 'red'
  };
  return colors[status] || 'gray';
};

/**
 * Get appointment status badge class
 */
export const getAppointmentStatusBadgeClass = (status) => {
  const color = getAppointmentStatusColor(status);
  return `badge-${color}`;
};

/**
 * Check if appointment is pending
 */
export const isPending = (appointment) => {
  return appointment.status === APPOINTMENT_STATUS.MENUNGGU;
};

/**
 * Check if appointment is confirmed
 */
export const isConfirmed = (appointment) => {
  return appointment.status === APPOINTMENT_STATUS.DIKONFIRMASI;
};

/**
 * Check if appointment is completed
 */
export const isCompleted = (appointment) => {
  return appointment.status === APPOINTMENT_STATUS.SELESAI;
};

/**
 * Check if appointment is cancelled
 */
export const isCancelled = (appointment) => {
  return appointment.status === APPOINTMENT_STATUS.DIBATALKAN;
};

/**
 * Check if appointment is upcoming
 */
export const isUpcoming = (appointment) => {
  if (isCancelled(appointment) || isCompleted(appointment)) return false;
  
  const appointmentDate = new Date(appointment.appointment_date);
  const now = new Date();
  
  return appointmentDate > now;
};

/**
 * Check if appointment is today
 */
export const isToday = (appointment) => {
  const appointmentDate = new Date(appointment.appointment_date);
  const today = new Date();
  
  return appointmentDate.toDateString() === today.toDateString();
};

/**
 * Check if appointment is tomorrow
 */
export const isTomorrow = (appointment) => {
  const appointmentDate = new Date(appointment.appointment_date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return appointmentDate.toDateString() === tomorrow.toDateString();
};

/**
 * Get time until appointment
 */
export const getTimeUntilAppointment = (appointment) => {
  const appointmentDate = new Date(appointment.appointment_date);
  appointmentDate.setHours(
    parseInt(appointment.appointment_time.split(':')[0]),
    parseInt(appointment.appointment_time.split(':')[1])
  );
  
  const now = new Date();
  const diff = appointmentDate - now;
  
  if (diff < 0) return 'Sudah lewat';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} hari lagi`;
  if (hours > 0) return `${hours} jam lagi`;
  if (minutes > 0) return `${minutes} menit lagi`;
  
  return 'Kurang dari 1 menit';
};

/**
 * Check if appointment can be cancelled
 */
export const canBeCancelled = (appointment) => {
  return isPending(appointment) || isConfirmed(appointment);
};

/**
 * Check if appointment can be rescheduled
 */
export const canBeRescheduled = (appointment) => {
  return isPending(appointment) || isConfirmed(appointment);
};

/**
 * Generate time slots
 */
export const generateTimeSlots = (startHour = 8, endHour = 20, interval = 30) => {
  const slots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  
  return slots;
};

/**
 * Format appointment time
 */
export const formatAppointmentTime = (time) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

/**
 * Format appointment date with time
 */
export const formatAppointmentDateTime = (date, time) => {
  const d = new Date(date);
  const formattedDate = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return `${formattedDate}, ${time} WIB`;
};

/**
 * Get appointment duration in minutes
 */
export const getAppointmentDuration = (appointment) => {
  // Default duration is 30 minutes for donation
  return 30;
};

/**
 * Calculate appointment end time
 */
export const getAppointmentEndTime = (appointment) => {
  const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
  const duration = getAppointmentDuration(appointment);
  
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

/**
 * Check if time slot is available
 */
export const isTimeSlotAvailable = (time, bookedSlots) => {
  return !bookedSlots.includes(time);
};

/**
 * Get available time slots
 */
export const getAvailableTimeSlots = (allSlots, bookedSlots) => {
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

/**
 * Validate appointment data
 */
export const validateAppointmentData = (data) => {
  const errors = {};
  
  if (!data.hospital_id) {
    errors.hospital_id = 'Rumah sakit wajib dipilih';
  }
  
  if (!data.appointment_date) {
    errors.appointment_date = 'Tanggal janji temu wajib dipilih';
  }
  
  if (!data.appointment_time) {
    errors.appointment_time = 'Waktu janji temu wajib dipilih';
  }
  
  // Check if date is in the past
  if (data.appointment_date) {
    const selectedDate = new Date(data.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.appointment_date = 'Tanggal tidak boleh di masa lalu';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Generate appointment code
 */
export const generateAppointmentCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `APT-${year}${month}${day}-${random}`;
};