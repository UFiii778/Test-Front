// =====================================================
// FILE: frontend/src/utils/donorUtils.js
// DESKRIPSI: Donor utilities
// =====================================================

import { DONATION_CONSTRAINTS } from './constants';

/**
 * Check if donor is eligible based on last donation
 */
export const isEligibleByDate = (lastDonationDate) => {
  if (!lastDonationDate) return true;
  
  const lastDonation = new Date(lastDonationDate);
  const nextEligible = new Date(lastDonation);
  nextEligible.setDate(nextEligible.getDate() + DONATION_CONSTRAINTS.MIN_INTERVAL_DAYS);
  
  return new Date() >= nextEligible;
};

/**
 * Check if donor is eligible based on weight
 */
export const isEligibleByWeight = (weight) => {
  return weight >= DONATION_CONSTRAINTS.MIN_WEIGHT;
};

/**
 * Check if donor is eligible based on age
 */
export const isEligibleByAge = (birthDate) => {
  if (!birthDate) return true;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= DONATION_CONSTRAINTS.MIN_AGE && 
         age <= DONATION_CONSTRAINTS.MAX_AGE;
};

/**
 * Check if donor is eligible
 */
export const isEligible = (donor) => {
  const checks = {
    byDate: isEligibleByDate(donor.last_donation_date),
    byWeight: isEligibleByWeight(donor.weight),
    byAge: isEligibleByAge(donor.birth_date)
  };
  
  return {
    eligible: Object.values(checks).every(Boolean),
    checks
  };
};

/**
 * Get next eligible date
 */
export const getNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) return new Date();
  
  const lastDonation = new Date(lastDonationDate);
  const nextEligible = new Date(lastDonation);
  nextEligible.setDate(nextEligible.getDate() + DONATION_CONSTRAINTS.MIN_INTERVAL_DAYS);
  
  return nextEligible;
};

/**
 * Get days until eligible
 */
export const getDaysUntilEligible = (lastDonationDate) => {
  if (!lastDonationDate) return 0;
  
  const nextEligible = getNextEligibleDate(lastDonationDate);
  const now = new Date();
  
  if (now >= nextEligible) return 0;
  
  const diff = nextEligible - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Get donor level based on total donations
 */
export const getDonorLevel = (totalDonations) => {
  if (totalDonations >= 50) return { level: 'Platinum', color: 'purple' };
  if (totalDonations >= 25) return { level: 'Gold', color: 'yellow' };
  if (totalDonations >= 10) return { level: 'Silver', color: 'gray' };
  if (totalDonations >= 5) return { level: 'Bronze', color: 'orange' };
  return { level: 'Pemula', color: 'blue' };
};

/**
 * Get next level requirement
 */
export const getNextLevelRequirement = (totalDonations) => {
  if (totalDonations < 5) return 5 - totalDonations;
  if (totalDonations < 10) return 10 - totalDonations;
  if (totalDonations < 25) return 25 - totalDonations;
  if (totalDonations < 50) return 50 - totalDonations;
  return null;
};

/**
 * Get donor badge based on total donations
 */
export const getDonorBadge = (totalDonations) => {
  const badges = [];
  
  if (totalDonations >= 1) badges.push('first_donation');
  if (totalDonations >= 5) badges.push('regular_donor');
  if (totalDonations >= 10) badges.push('hero_donor');
  if (totalDonations >= 25) badges.push('life_saver');
  if (totalDonations >= 50) badges.push('legend');
  
  return badges;
};

/**
 * Format donation count
 */
export const formatDonationCount = (count) => {
  if (count === 1) return '1 kali donor';
  return `${count} kali donor`;
};

/**
 * Format last donation date
 */
export const formatLastDonation = (date) => {
  if (!date) return 'Belum pernah donor';
  
  const days = getDaysUntilEligible(date);
  if (days === 0) return 'Siap donor';
  
  return `${days} hari lagi`;
};

/**
 * Calculate donation streak
 */
export const calculateDonationStreak = (donations) => {
  if (!donations || donations.length === 0) return 0;
  
  const sorted = [...donations].sort((a, b) => 
    new Date(b.donation_date) - new Date(a.donation_date)
  );
  
  let streak = 1;
  let currentDate = new Date(sorted[0].donation_date);
  
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i].donation_date);
    const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= DONATION_CONSTRAINTS.MIN_INTERVAL_DAYS + 30) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get donation statistics
 */
export const getDonationStats = (donations) => {
  const total = donations.length;
  const totalBlood = donations.reduce((sum, d) => sum + (d.quantity || 1), 0);
  const uniqueHospitals = new Set(donations.map(d => d.hospital_id)).size;
  const firstDonation = donations.length > 0 
    ? new Date(Math.min(...donations.map(d => new Date(d.donation_date))))
    : null;
  const lastDonation = donations.length > 0
    ? new Date(Math.max(...donations.map(d => new Date(d.donation_date))))
    : null;
  
  return {
    total,
    totalBlood,
    uniqueHospitals,
    firstDonation,
    lastDonation,
    streak: calculateDonationStreak(donations)
  };
};

/**
 * Get donor achievements
 */
export const getDonorAchievements = (donor) => {
  const achievements = [];
  const stats = donor.stats || {};
  
  if (stats.total >= 1) {
    achievements.push({
      id: 'first_donation',
      title: 'Donor Pertama',
      description: 'Melakukan donor darah pertama',
      achieved: true,
      icon: '🩸'
    });
  }
  
  if (stats.total >= 5) {
    achievements.push({
      id: 'regular_donor',
      title: 'Donor Reguler',
      description: 'Telah donor 5 kali',
      achieved: true,
      icon: '🌟'
    });
  }
  
  if (stats.total >= 10) {
    achievements.push({
      id: 'hero_donor',
      title: 'Pahlawan Donor',
      description: 'Telah donor 10 kali',
      achieved: true,
      icon: '🦸'
    });
  }
  
  if (stats.streak >= 2) {
    achievements.push({
      id: 'consistent',
      title: 'Konsisten',
      description: 'Donor rutin tanpa putus',
      achieved: true,
      icon: '📅'
    });
  }
  
  return achievements;
};

/**
 * Validate donor data
 */
export const validateDonorData = (data) => {
  const errors = {};
  
  if (data.weight && (data.weight < 30 || data.weight > 200)) {
    errors.weight = 'Berat badan harus antara 30-200 kg';
  }
  
  if (data.height && (data.height < 100 || data.height > 250)) {
    errors.height = 'Tinggi badan harus antara 100-250 cm';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};