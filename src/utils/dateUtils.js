// =====================================================
// FILE: frontend/src/utils/dateUtils.js
// DESKRIPSI: Date utilities
// =====================================================

/**
 * Format date to Indonesia format
 */
export const formatDate = (date, format = 'dd MMMM yyyy') => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  const dayName = days[d.getDay()];

  return format
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('d', day)
    .replace('MMMM', month)
    .replace('MMM', month.substring(0, 3))
    .replace('MM', (d.getMonth() + 1).toString().padStart(2, '0'))
    .replace('M', d.getMonth() + 1)
    .replace('yyyy', year)
    .replace('yy', year.toString().slice(-2))
    .replace('HH', hour)
    .replace('H', parseInt(hour))
    .replace('hh', (parseInt(hour) % 12 || 12).toString().padStart(2, '0'))
    .replace('h', parseInt(hour) % 12 || 12)
    .replace('mm', minute)
    .replace('m', parseInt(minute))
    .replace('ss', second)
    .replace('s', parseInt(second))
    .replace('dddd', dayName)
    .replace('ddd', dayName.substring(0, 3));
};

/**
 * Format date to ISO string
 */
export const formatISO = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Format date to database format (YYYY-MM-DD)
 */
export const formatDB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format time only (HH:MM)
 */
export const formatTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Get relative time (e.g., "2 jam yang lalu")
 */
export const getRelativeTime = (date) => {
  if (!date) return null;
  
  const now = new Date();
  const past = new Date(date);
  const diff = now - past;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) return `${years} tahun yang lalu`;
  if (months > 0) return `${months} bulan yang lalu`;
  if (weeks > 0) return `${weeks} minggu yang lalu`;
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return `${seconds} detik yang lalu`;
};

/**
 * Get time ago in short format
 */
export const getTimeAgoShort = (date) => {
  if (!date) return null;
  
  const now = new Date();
  const past = new Date(date);
  const diff = now - past;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) return `${years}thn`;
  if (months > 0) return `${months}bln`;
  if (days > 0) return `${days}hr`;
  if (hours > 0) return `${hours}jm`;
  if (minutes > 0) return `${minutes}mnt`;
  return `${seconds}dtk`;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const d = new Date(date);
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date) => {
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const d = new Date(date);
  
  return d.getDate() === tomorrow.getDate() &&
         d.getMonth() === tomorrow.getMonth() &&
         d.getFullYear() === tomorrow.getFullYear();
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const d = new Date(date);
  
  return d.getDate() === yesterday.getDate() &&
         d.getMonth() === yesterday.getMonth() &&
         d.getFullYear() === yesterday.getFullYear();
};

/**
 * Get start of day
 */
export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week (Monday)
 */
export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of week (Sunday)
 */
export const endOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of month
 */
export const startOfMonth = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of month
 */
export const endOfMonth = (date = new Date()) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of year
 */
export const startOfYear = (year = new Date().getFullYear()) => {
  return new Date(year, 0, 1, 0, 0, 0, 0);
};

/**
 * Get end of year
 */
export const endOfYear = (year = new Date().getFullYear()) => {
  return new Date(year, 11, 31, 23, 59, 59, 999);
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 */
export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 */
export const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get difference in days
 */
export const diffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in hours
 */
export const diffInHours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

/**
 * Get difference in minutes
 */
export const diffInMinutes = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60));
};

/**
 * Format date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate, 'dd MMMM yyyy');
  const end = formatDate(endDate, 'dd MMMM yyyy');
  
  if (start === end) return start;
  return `${start} - ${end}`;
};

/**
 * Get age from birth date
 */
export const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if date is valid
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Parse date from string
 */
export const parseDate = (dateString, format = 'YYYY-MM-DD') => {
  // Simple parsing - in production use a library like date-fns
  const parts = dateString.split(/[-\/]/);
  if (format === 'YYYY-MM-DD' && parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  if (format === 'DD-MM-YYYY' && parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date(dateString);
};

/**
 * Get month name
 */
export const getMonthName = (month, short = false) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  return short ? shortMonths[month] : months[month];
};

/**
 * Get day name
 */
export const getDayName = (day, short = false) => {
  const days = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  
  const shortDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  return short ? shortDays[day] : days[day];
};

/**
 * Get days in month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Check if year is leap year
 */
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get quarter from date
 */
export const getQuarter = (date) => {
  const month = new Date(date).getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Get week number
 */
export const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};