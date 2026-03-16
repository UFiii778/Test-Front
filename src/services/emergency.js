// =====================================================
// FILE: frontend/src/services/emergency.js
// DESKRIPSI: Emergency service
// =====================================================

import api from './api';

const emergencyService = {
  /**
   * Create emergency request
   */
  createEmergency: async (emergencyData) => {
    try {
      const response = await api.post('/emergency/request', emergencyData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get active emergencies
   */
  getActive: async () => {
    try {
      const response = await api.get('/emergency/active');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency details
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/emergency/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Resolve emergency
   */
  resolveEmergency: async (id, notes = '') => {
    try {
      const response = await api.post(`/emergency/${id}/resolve`, { notes });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/emergency/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Broadcast emergency message
   */
  broadcast: async (broadcastData) => {
    try {
      const response = await api.post('/emergency/broadcast', broadcastData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency contacts
   */
  getContacts: async () => {
    try {
      const response = await api.get('/emergency/contacts');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add emergency contact
   */
  addContact: async (contactData) => {
    try {
      const response = await api.post('/emergency/contacts', contactData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update emergency contact
   */
  updateContact: async (contactId, contactData) => {
    try {
      const response = await api.put(`/emergency/contacts/${contactId}`, contactData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete emergency contact
   */
  deleteContact: async (contactId) => {
    try {
      const response = await api.delete(`/emergency/contacts/${contactId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency alerts history
   */
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/emergency/history', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get nearby emergency facilities
   */
  getNearbyFacilities: async (lat, lng, type = 'hospital') => {
    try {
      const response = await api.get('/emergency/nearby', {
        params: { lat, lng, type }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to emergency alerts
   */
  subscribe: async (userId, preferences) => {
    try {
      const response = await api.post('/emergency/subscribe', { userId, ...preferences });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unsubscribe from emergency alerts
   */
  unsubscribe: async (userId) => {
    try {
      const response = await api.delete(`/emergency/subscribe/${userId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency protocols
   */
  getProtocols: async () => {
    try {
      const response = await api.get('/emergency/protocols');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency protocol by ID
   */
  getProtocolById: async (protocolId) => {
    try {
      const response = await api.get(`/emergency/protocols/${protocolId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create emergency protocol (Admin only)
   */
  createProtocol: async (protocolData) => {
    try {
      const response = await api.post('/emergency/protocols', protocolData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update emergency protocol (Admin only)
   */
  updateProtocol: async (protocolId, protocolData) => {
    try {
      const response = await api.put(`/emergency/protocols/${protocolId}`, protocolData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete emergency protocol (Admin only)
   */
  deleteProtocol: async (protocolId) => {
    try {
      const response = await api.delete(`/emergency/protocols/${protocolId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency response teams
   */
  getResponseTeams: async () => {
    try {
      const response = await api.get('/emergency/teams');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Deploy emergency team
   */
  deployTeam: async (teamId, deploymentData) => {
    try {
      const response = await api.post(`/emergency/teams/${teamId}/deploy`, deploymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get team status
   */
  getTeamStatus: async (teamId) => {
    try {
      const response = await api.get(`/emergency/teams/${teamId}/status`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update team status
   */
  updateTeamStatus: async (teamId, status) => {
    try {
      const response = await api.put(`/emergency/teams/${teamId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency resources
   */
  getResources: async () => {
    try {
      const response = await api.get('/emergency/resources');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Request emergency resource
   */
  requestResource: async (resourceData) => {
    try {
      const response = await api.post('/emergency/resources/request', resourceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update resource availability
   */
  updateResource: async (resourceId, availability) => {
    try {
      const response = await api.put(`/emergency/resources/${resourceId}`, { availability });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency drill schedule
   */
  getDrillSchedule: async () => {
    try {
      const response = await api.get('/emergency/drills');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Schedule emergency drill
   */
  scheduleDrill: async (drillData) => {
    try {
      const response = await api.post('/emergency/drills', drillData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get drill results
   */
  getDrillResults: async (drillId) => {
    try {
      const response = await api.get(`/emergency/drills/${drillId}/results`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Test emergency alert system
   */
  testAlert: async () => {
    try {
      const response = await api.post('/emergency/test');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default emergencyService;