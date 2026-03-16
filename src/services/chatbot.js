// =====================================================
// FILE: frontend/src/services/chatbot.js
// DESKRIPSI: Chatbot service
// =====================================================

import api from './api';

const chatbotService = {
  /**
   * Send message to chatbot
   */
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chatbot/message', { message });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get conversation history
   */
  getHistory: async () => {
    try {
      const response = await api.get('/chatbot/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Rate conversation
   */
  rateConversation: async (conversationId, rating, feedback = '') => {
    try {
      const response = await api.post('/chatbot/rate', {
        conversationId,
        rating,
        feedback
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get FAQ list
   */
  getFAQ: async () => {
    try {
      const response = await api.get('/chatbot/faq');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Train chatbot (Admin only)
   */
  train: async (intent, keywords, responses) => {
    try {
      const response = await api.post('/chatbot/train', {
        intent,
        keywords,
        responses
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get chatbot analytics (Admin only)
   */
  getAnalytics: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/chatbot/analytics', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get unanswered questions (Admin only)
   */
  getUnanswered: async (limit = 50) => {
    try {
      const response = await api.get('/chatbot/unanswered', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add intent (Admin only)
   */
  addIntent: async (intentData) => {
    try {
      const response = await api.post('/chatbot/intents', intentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update intent (Admin only)
   */
  updateIntent: async (intentId, intentData) => {
    try {
      const response = await api.put(`/chatbot/intents/${intentId}`, intentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete intent (Admin only)
   */
  deleteIntent: async (intentId) => {
    try {
      const response = await api.delete(`/chatbot/intents/${intentId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all intents (Admin only)
   */
  getIntents: async () => {
    try {
      const response = await api.get('/chatbot/intents');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Test intent matching
   */
  testIntent: async (message) => {
    try {
      const response = await api.post('/chatbot/test', { message });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get chatbot settings (Admin only)
   */
  getSettings: async () => {
    try {
      const response = await api.get('/chatbot/settings');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update chatbot settings (Admin only)
   */
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/chatbot/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset chatbot knowledge (Admin only)
   */
  reset: async () => {
    try {
      const response = await api.post('/chatbot/reset');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export chatbot data (Admin only)
   */
  exportData: async () => {
    try {
      const response = await api.download('/chatbot/export', {}, 'chatbot-data.json');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Import chatbot data (Admin only)
   */
  importData: async (file) => {
    try {
      const response = await api.upload('/chatbot/import', file, 'file');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get conversation by ID
   */
  getConversation: async (conversationId) => {
    try {
      const response = await api.get(`/chatbot/conversations/${conversationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete conversation
   */
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/chatbot/conversations/${conversationId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear all conversations (Admin only)
   */
  clearAllConversations: async () => {
    try {
      const response = await api.delete('/chatbot/conversations');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get conversation statistics
   */
  getConversationStats: async (params = {}) => {
    try {
      const response = await api.get('/chatbot/conversations/stats', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get popular questions
   */
  getPopularQuestions: async (limit = 10) => {
    try {
      const response = await api.get('/chatbot/popular-questions', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get satisfaction rate
   */
  getSatisfactionRate: async (params = {}) => {
    try {
      const response = await api.get('/chatbot/satisfaction', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default chatbotService;