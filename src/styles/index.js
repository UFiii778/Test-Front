// =====================================================
// FILE: frontend/src/styles/index.js
// DESKRIPSI: Central export for all styles
// =====================================================

// Import all CSS files (for Webpack/CRA)
import './index.css';
import './variables.css';
import './tailwind.css';
import './globals.css';
import './typography.css';
import './colors.css';
import './animations.css';
import './components.css';
import './forms.css';
import './buttons.css';
import './cards.css';
import './tables.css';
import './modals.css';
import './utilities.css';
import './responsive.css';
import './print.css';
import './darkMode.css';
import './bloodTypes.css';
import './status.css';
import './dashboard.css';

// Export theme variables for JavaScript
export const theme = {
  colors: {
    primary: {
      50: 'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      200: 'var(--color-primary-200)',
      300: 'var(--color-primary-300)',
      400: 'var(--color-primary-400)',
      500: 'var(--color-primary-500)',
      600: 'var(--color-primary-600)',
      700: 'var(--color-primary-700)',
      800: 'var(--color-primary-800)',
      900: 'var(--color-primary-900)',
      950: 'var(--color-primary-950)',
    },
    secondary: {
      50: 'var(--color-secondary-50)',
      100: 'var(--color-secondary-100)',
      200: 'var(--color-secondary-200)',
      300: 'var(--color-secondary-300)',
      400: 'var(--color-secondary-400)',
      500: 'var(--color-secondary-500)',
      600: 'var(--color-secondary-600)',
      700: 'var(--color-secondary-700)',
      800: 'var(--color-secondary-800)',
      900: 'var(--color-secondary-900)',
      950: 'var(--color-secondary-950)',
    },
    success: {
      50: 'var(--color-success-50)',
      100: 'var(--color-success-100)',
      200: 'var(--color-success-200)',
      300: 'var(--color-success-300)',
      400: 'var(--color-success-400)',
      500: 'var(--color-success-500)',
      600: 'var(--color-success-600)',
      700: 'var(--color-success-700)',
      800: 'var(--color-success-800)',
      900: 'var(--color-success-900)',
      950: 'var(--color-success-950)',
    },
    warning: {
      50: 'var(--color-warning-50)',
      100: 'var(--color-warning-100)',
      200: 'var(--color-warning-200)',
      300: 'var(--color-warning-300)',
      400: 'var(--color-warning-400)',
      500: 'var(--color-warning-500)',
      600: 'var(--color-warning-600)',
      700: 'var(--color-warning-700)',
      800: 'var(--color-warning-800)',
      900: 'var(--color-warning-900)',
      950: 'var(--color-warning-950)',
    },
    danger: {
      50: 'var(--color-danger-50)',
      100: 'var(--color-danger-100)',
      200: 'var(--color-danger-200)',
      300: 'var(--color-danger-300)',
      400: 'var(--color-danger-400)',
      500: 'var(--color-danger-500)',
      600: 'var(--color-danger-600)',
      700: 'var(--color-danger-700)',
      800: 'var(--color-danger-800)',
      900: 'var(--color-danger-900)',
      950: 'var(--color-danger-950)',
    },
    info: {
      50: 'var(--color-info-50)',
      100: 'var(--color-info-100)',
      200: 'var(--color-info-200)',
      300: 'var(--color-info-300)',
      400: 'var(--color-info-400)',
      500: 'var(--color-info-500)',
      600: 'var(--color-info-600)',
      700: 'var(--color-info-700)',
      800: 'var(--color-info-800)',
      900: 'var(--color-info-900)',
      950: 'var(--color-info-950)',
    },
    blood: {
      a: 'var(--color-blood-a)',
      b: 'var(--color-blood-b)',
      ab: 'var(--color-blood-ab)',
      o: 'var(--color-blood-o)',
    },
    status: {
      pending: 'var(--color-status-pending)',
      processing: 'var(--color-status-processing)',
      completed: 'var(--color-status-completed)',
      cancelled: 'var(--color-status-cancelled)',
      verified: 'var(--color-status-verified)',
      unverified: 'var(--color-status-unverified)',
    },
  },
  spacing: {
    0: 'var(--spacing-0)',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    32: 'var(--spacing-32)',
    40: 'var(--spacing-40)',
    48: 'var(--spacing-48)',
    56: 'var(--spacing-56)',
    64: 'var(--spacing-64)',
  },
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
  },
  fontWeight: {
    thin: 'var(--font-weight-thin)',
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
    black: 'var(--font-weight-black)',
  },
  borderRadius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    inner: 'var(--shadow-inner)',
  },
  transition: {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
    slow: 'var(--transition-slow)',
  },
  zIndex: {
    0: 'var(--z-0)',
    10: 'var(--z-10)',
    20: 'var(--z-20)',
    30: 'var(--z-30)',
    40: 'var(--z-40)',
    50: 'var(--z-50)',
    auto: 'var(--z-auto)',
    dropdown: 'var(--z-dropdown)',
    sticky: 'var(--z-sticky)',
    fixed: 'var(--z-fixed)',
    modalBackdrop: 'var(--z-modal-backdrop)',
    modal: 'var(--z-modal)',
    popover: 'var(--z-popover)',
    tooltip: 'var(--z-tooltip)',
    toast: 'var(--z-toast)',
  },
  breakpoints: {
    sm: 'var(--breakpoint-sm)',
    md: 'var(--breakpoint-md)',
    lg: 'var(--breakpoint-lg)',
    xl: 'var(--breakpoint-xl)',
    '2xl': 'var(--breakpoint-2xl)',
  },
  header: {
    height: 'var(--header-height)',
    heightMobile: 'var(--header-height-mobile)',
  },
  sidebar: {
    width: 'var(--sidebar-width)',
    widthCollapsed: 'var(--sidebar-width-collapsed)',
  },
  container: {
    maxWidth: 'var(--container-max-width)',
    padding: 'var(--container-padding)',
  },
};

// Export CSS classes as constants
export const classes = {
  container: 'container',
  containerCustom: 'container-custom',
  
  // Buttons
  btn: 'btn',
  btnPrimary: 'btn-primary',
  btnSecondary: 'btn-secondary',
  btnOutline: 'btn-outline',
  btnDanger: 'btn-danger',
  btnSuccess: 'btn-success',
  btnWarning: 'btn-warning',
  btnInfo: 'btn-info',
  btnGhost: 'btn-ghost',
  btnLink: 'btn-link',
  
  // Cards
  card: 'card',
  cardHover: 'card-hover',
  cardHeader: 'card-header',
  cardBody: 'card-body',
  cardFooter: 'card-footer',
  
  // Forms
  formGroup: 'form-group',
  formControl: 'form-control',
  formLabel: 'form-label',
  formFeedback: 'form-feedback',
  formHint: 'form-hint',
  
  // Badges
  badge: 'badge',
  badgePrimary: 'badge-primary',
  badgeSuccess: 'badge-success',
  badgeWarning: 'badge-warning',
  badgeDanger: 'badge-danger',
  badgeInfo: 'badge-info',
  
  // Tables
  table: 'table',
  tableContainer: 'table-container',
  tableStriped: 'table-striped',
  tableHover: 'table-hover',
  tableBordered: 'table-bordered',
  
  // Modals
  modalOverlay: 'modal-overlay',
  modalContent: 'modal-content',
  modalHeader: 'modal-header',
  modalBody: 'modal-body',
  modalFooter: 'modal-footer',
  
  // Utilities
  textPrimary: 'text-primary',
  textSuccess: 'text-success',
  textWarning: 'text-warning',
  textDanger: 'text-danger',
  textInfo: 'text-info',
  
  bgPrimary: 'bg-primary',
  bgSuccess: 'bg-success',
  bgWarning: 'bg-warning',
  bgDanger: 'bg-danger',
  bgInfo: 'bg-info',
  
  // Blood types
  bloodTypeA: 'blood-type-a',
  bloodTypeB: 'blood-type-b',
  bloodTypeAB: 'blood-type-ab',
  bloodTypeO: 'blood-type-o',
  
  // Status
  statusSuccess: 'status-success',
  statusWarning: 'status-warning',
  statusDanger: 'status-danger',
  statusInfo: 'status-info',
};

// Export theme getter function
export const getThemeValue = (path, defaultValue = null) => {
  const keys = path.split('.');
  let value = theme;
  
  for (const key of keys) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value;
};

// Export CSS variable getter
export const getCssVariable = (name) => {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

// Export theme to CSS variables helper
export const setThemeVariable = (name, value) => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
};