// =====================================================
// FILE: frontend/src/utils/bloodTypeUtils.js
// DESKRIPSI: Blood type utilities
// =====================================================

import { BLOOD_TYPES, BLOOD_TYPE_MAP } from './constants';

/**
 * Get all blood types
 */
export const getAllBloodTypes = () => {
  return BLOOD_TYPES;
};

/**
 * Get blood type label
 */
export const getBloodTypeLabel = (bloodType) => {
  return BLOOD_TYPE_MAP[bloodType]?.label || bloodType;
};

/**
 * Get blood type color
 */
export const getBloodTypeColor = (bloodType) => {
  return BLOOD_TYPE_MAP[bloodType]?.color || 'gray';
};

/**
 * Get blood type badge class
 */
export const getBloodTypeBadgeClass = (bloodType) => {
  const color = getBloodTypeColor(bloodType);
  return `badge-${color}`;
};

/**
 * Check if blood type is valid
 */
export const isValidBloodType = (bloodType) => {
  return !!BLOOD_TYPE_MAP[bloodType];
};

/**
 * Get compatible blood types for donation
 */
export const getCompatibleDonors = (bloodType) => {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  
  return compatibility[bloodType] || [];
};

/**
 * Get compatible blood types for receiving
 */
export const getCompatibleRecipients = (bloodType) => {
  const compatibility = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };
  
  return compatibility[bloodType] || [];
};

/**
 * Check if blood type can donate to another
 */
export const canDonateTo = (donorType, recipientType) => {
  const compatible = getCompatibleRecipients(donorType);
  return compatible.includes(recipientType);
};

/**
 * Check if blood type can receive from another
 */
export const canReceiveFrom = (recipientType, donorType) => {
  const compatible = getCompatibleDonors(recipientType);
  return compatible.includes(donorType);
};

/**
 * Get blood type with rhesus
 */
export const formatBloodType = (type, rhesus) => {
  if (!type) return '-';
  if (!rhesus) return type;
  return `${type}${rhesus === 'positif' ? '+' : '-'}`;
};

/**
 * Parse blood type string
 */
export const parseBloodType = (bloodType) => {
  const match = bloodType.match(/^([ABO]+)([+-])$/);
  if (!match) return null;
  
  return {
    type: match[1],
    rhesus: match[2] === '+' ? 'positif' : 'negatif'
  };
};

/**
 * Get blood type description
 */
export const getBloodTypeDescription = (bloodType) => {
  const descriptions = {
    'A+': 'Memiliki antigen A dan faktor Rh',
    'A-': 'Memiliki antigen A, tidak memiliki faktor Rh',
    'B+': 'Memiliki antigen B dan faktor Rh',
    'B-': 'Memiliki antigen B, tidak memiliki faktor Rh',
    'AB+': 'Memiliki antigen A dan B serta faktor Rh (penerima universal)',
    'AB-': 'Memiliki antigen A dan B, tidak memiliki faktor Rh',
    'O+': 'Tidak memiliki antigen A/B, memiliki faktor Rh',
    'O-': 'Tidak memiliki antigen A/B dan faktor Rh (donor universal)'
  };
  
  return descriptions[bloodType] || '';
};

/**
 * Get blood type statistics
 */
export const getBloodTypeStats = () => {
  return {
    'A+': { population: '35%', canDonateTo: 6, canReceiveFrom: 4 },
    'A-': { population: '6%', canDonateTo: 4, canReceiveFrom: 2 },
    'B+': { population: '8%', canDonateTo: 4, canReceiveFrom: 4 },
    'B-': { population: '2%', canDonateTo: 2, canReceiveFrom: 2 },
    'AB+': { population: '3%', canDonateTo: 1, canReceiveFrom: 8 },
    'AB-': { population: '1%', canDonateTo: 1, canReceiveFrom: 4 },
    'O+': { population: '37%', canDonateTo: 6, canReceiveFrom: 2 },
    'O-': { population: '8%', canDonateTo: 8, canReceiveFrom: 1 }
  };
};

/**
 * Get universal donor types
 */
export const getUniversalDonors = () => {
  return ['O-'];
};

/**
 * Get universal recipient types
 */
export const getUniversalRecipients = () => {
  return ['AB+'];
};

/**
 * Get rarest blood type
 */
export const getRarestBloodType = () => {
  return 'AB-';
};

/**
 * Get most common blood type
 */
export const getMostCommonBloodType = () => {
  return 'O+';
};

/**
 * Get blood type by population percentage
 */
export const getBloodTypesByPopulation = () => {
  return [
    { type: 'O+', percentage: 37 },
    { type: 'A+', percentage: 35 },
    { type: 'B+', percentage: 8 },
    { type: 'O-', percentage: 8 },
    { type: 'A-', percentage: 6 },
    { type: 'AB+', percentage: 3 },
    { type: 'B-', percentage: 2 },
    { type: 'AB-', percentage: 1 }
  ];
};