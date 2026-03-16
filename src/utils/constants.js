// =====================================================
// FILE: frontend/src/utils/constants.js
// DESKRIPSI: Application constants
// =====================================================

// User roles
export const ROLES = {
  ADMIN: 'admin',
  PMI: 'pmi',
  SUKARELAWAN: 'sukarelawan',
  PASIEN: 'pasien',
  PENDONOR: 'pendonor'
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.PMI]: 'PMI',
  [ROLES.SUKARELAWAN]: 'Sukarelawan',
  [ROLES.PASIEN]: 'Pasien',
  [ROLES.PENDONOR]: 'Pendonor'
};

export const ROLE_COLORS = {
  [ROLES.ADMIN]: 'purple',
  [ROLES.PMI]: 'blue',
  [ROLES.SUKARELAWAN]: 'green',
  [ROLES.PASIEN]: 'yellow',
  [ROLES.PENDONOR]: 'red'
};

// Blood types
export const BLOOD_TYPES = [
  { value: 'A+', label: 'A+', color: 'blue' },
  { value: 'A-', label: 'A-', color: 'blue' },
  { value: 'B+', label: 'B+', color: 'green' },
  { value: 'B-', label: 'B-', color: 'green' },
  { value: 'O+', label: 'O+', color: 'red' },
  { value: 'O-', label: 'O-', color: 'red' },
  { value: 'AB+', label: 'AB+', color: 'purple' },
  { value: 'AB-', label: 'AB-', color: 'purple' }
];

export const BLOOD_TYPE_MAP = {
  'A+': { label: 'A+', color: 'blue' },
  'A-': { label: 'A-', color: 'blue' },
  'B+': { label: 'B+', color: 'green' },
  'B-': { label: 'B-', color: 'green' },
  'O+': { label: 'O+', color: 'red' },
  'O-': { label: 'O-', color: 'red' },
  'AB+': { label: 'AB+', color: 'purple' },
  'AB-': { label: 'AB-', color: 'purple' }
};

// Rhesus
export const RHESUS = {
  POSITIF: 'positif',
  NEGATIF: 'negatif'
};

// Urgency levels
export const URGENCY = {
  BIASA: 'biasa',
  URGENT: 'urgent',
  GAWAT_DARURAT: 'gawat_darurat'
};

export const URGENCY_LABELS = {
  [URGENCY.BIASA]: 'Biasa',
  [URGENCY.URGENT]: 'Urgent',
  [URGENCY.GAWAT_DARURAT]: 'Gawat Darurat'
};

export const URGENCY_COLORS = {
  [URGENCY.BIASA]: 'blue',
  [URGENCY.URGENT]: 'yellow',
  [URGENCY.GAWAT_DARURAT]: 'red'
};

// Request status
export const REQUEST_STATUS = {
  MENUNGGU: 'menunggu',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
  DIBATALKAN: 'dibatalkan'
};

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.MENUNGGU]: 'Menunggu',
  [REQUEST_STATUS.DIPROSES]: 'Diproses',
  [REQUEST_STATUS.SELESAI]: 'Selesai',
  [REQUEST_STATUS.DIBATALKAN]: 'Dibatalkan'
};

export const REQUEST_STATUS_COLORS = {
  [REQUEST_STATUS.MENUNGGU]: 'yellow',
  [REQUEST_STATUS.DIPROSES]: 'blue',
  [REQUEST_STATUS.SELESAI]: 'green',
  [REQUEST_STATUS.DIBATALKAN]: 'red'
};

// Response status
export const RESPONSE_STATUS = {
  TERSEDIA: 'tersedia',
  PERTIMBANGAN: 'pertimbangan',
  TIDAK_TERSEDIA: 'tidak_tersedia'
};

export const RESPONSE_STATUS_LABELS = {
  [RESPONSE_STATUS.TERSEDIA]: 'Tersedia',
  [RESPONSE_STATUS.PERTIMBANGAN]: 'Sedang Dipertimbangkan',
  [RESPONSE_STATUS.TIDAK_TERSEDIA]: 'Tidak Tersedia'
};

export const RESPONSE_STATUS_COLORS = {
  [RESPONSE_STATUS.TERSEDIA]: 'green',
  [RESPONSE_STATUS.PERTIMBANGAN]: 'yellow',
  [RESPONSE_STATUS.TIDAK_TERSEDIA]: 'red'
};

// Appointment status
export const APPOINTMENT_STATUS = {
  MENUNGGU: 'menunggu',
  DIKONFIRMASI: 'dikonfirmasi',
  SELESAI: 'selesai',
  DIBATALKAN: 'dibatalkan'
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.MENUNGGU]: 'Menunggu Konfirmasi',
  [APPOINTMENT_STATUS.DIKONFIRMASI]: 'Dikonfirmasi',
  [APPOINTMENT_STATUS.SELESAI]: 'Selesai',
  [APPOINTMENT_STATUS.DIBATALKAN]: 'Dibatalkan'
};

// Notification types
export const NOTIFICATION_TYPES = {
  PERMINTAAN: 'permintaan',
  RESPON: 'respon',
  PENGINGAT: 'pengingat',
  INFO: 'info',
  DARURAT: 'darurat',
  SISTEM: 'sistem'
};

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.PERMINTAAN]: 'Permintaan Baru',
  [NOTIFICATION_TYPES.RESPON]: 'Respon Donor',
  [NOTIFICATION_TYPES.PENGINGAT]: 'Pengingat',
  [NOTIFICATION_TYPES.INFO]: 'Informasi',
  [NOTIFICATION_TYPES.DARURAT]: 'Darurat',
  [NOTIFICATION_TYPES.SISTEM]: 'Sistem'
};

// News categories
export const NEWS_CATEGORIES = {
  BERITA: 'berita',
  ARTIKEL: 'artikel',
  PENGUMUMAN: 'pengumuman',
  KEGIATAN: 'kegiatan'
};

export const NEWS_CATEGORY_LABELS = {
  [NEWS_CATEGORIES.BERITA]: 'Berita',
  [NEWS_CATEGORIES.ARTIKEL]: 'Artikel',
  [NEWS_CATEGORIES.PENGUMUMAN]: 'Pengumuman',
  [NEWS_CATEGORIES.KEGIATAN]: 'Kegiatan'
};

// Blood stock status
export const STOCK_STATUS = {
  AMAN: 'aman',
  WASPADA: 'waspada',
  KRITIS: 'kritis'
};

export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.AMAN]: 'Aman',
  [STOCK_STATUS.WASPADA]: 'Waspada',
  [STOCK_STATUS.KRITIS]: 'Kritis'
};

export const STOCK_STATUS_COLORS = {
  [STOCK_STATUS.AMAN]: 'green',
  [STOCK_STATUS.WASPADA]: 'yellow',
  [STOCK_STATUS.KRITIS]: 'red'
};

// Donation constraints
export const DONATION_CONSTRAINTS = {
  MIN_WEIGHT: 45,
  MIN_AGE: 17,
  MAX_AGE: 60,
  MIN_INTERVAL_DAYS: 90,
  MAX_DONATION_PER_YEAR: 5,
  MIN_HEMOGLOBIN: 12.5,
  MAX_HEMOGLOBIN: 17.0
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date formats
export const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  INDONESIAN: 'DD MMMM YYYY',
  INDONESIAN_FULL: 'dddd, DD MMMM YYYY',
  INDONESIAN_DATETIME: 'DD MMMM YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// File upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_PROFILE_SIZE: 2 * 1024 * 1024,
  MAX_CERTIFICATE_SIZE: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf']
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  HOSPITALS: '/hospitals',
  BLOOD_STOCK: '/blood-stock',
  REQUESTS: '/requests',
  APPOINTMENTS: '/appointments',
  DONOR: '/donor',
  NEWS: '/news',
  NOTIFICATIONS: '/notifications',
  CHATBOT: '/chatbot',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  ADMIN: '/admin',
  EMERGENCY: '/emergency'
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Error messages
export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Email atau password salah',
  ACCOUNT_NOT_VERIFIED: 'Akun belum diverifikasi',
  ACCOUNT_BLOCKED: 'Akun telah diblokir',
  TOKEN_EXPIRED: 'Token telah kadaluarsa',
  TOKEN_INVALID: 'Token tidak valid',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  FORBIDDEN: 'Akses ditolak',
  
  // User errors
  USER_NOT_FOUND: 'User tidak ditemukan',
  EMAIL_EXISTS: 'Email sudah terdaftar',
  PHONE_EXISTS: 'Nomor telepon sudah terdaftar',
  
  // Validation errors
  VALIDATION_ERROR: 'Validasi gagal',
  INVALID_INPUT: 'Input tidak valid',
  
  // Resource errors
  NOT_FOUND: 'Data tidak ditemukan',
  ALREADY_EXISTS: 'Data sudah ada',
  
  // Donation errors
  DONATION_INTERVAL: 'Jarak donor minimal 3 bulan',
  WEIGHT_TOO_LOW: 'Berat badan minimal 45 kg',
  NOT_ELIGIBLE: 'Tidak memenuhi syarat donor',
  
  // Server errors
  INTERNAL_ERROR: 'Terjadi kesalahan server',
  SERVICE_UNAVAILABLE: 'Layanan tidak tersedia',
  DATABASE_ERROR: 'Kesalahan database'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil',
  LOGOUT_SUCCESS: 'Logout berhasil',
  REGISTER_SUCCESS: 'Registrasi berhasil',
  UPDATE_SUCCESS: 'Data berhasil diperbarui',
  DELETE_SUCCESS: 'Data berhasil dihapus',
  CREATE_SUCCESS: 'Data berhasil dibuat',
  
  REQUEST_CREATED: 'Permintaan donor berhasil dibuat',
  REQUEST_UPDATED: 'Permintaan berhasil diperbarui',
  RESPONSE_SENT: 'Respon berhasil dikirim',
  
  APPOINTMENT_CREATED: 'Janji temu berhasil dibuat',
  APPOINTMENT_UPDATED: 'Janji temu berhasil diperbarui',
  
  DONATION_SUCCESS: 'Donor darah berhasil',
  VERIFICATION_SUCCESS: 'Verifikasi berhasil',
  
  EMAIL_SENT: 'Email berhasil dikirim',
  PASSWORD_RESET: 'Password berhasil direset'
};