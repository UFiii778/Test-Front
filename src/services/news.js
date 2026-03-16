// =====================================================
// FILE: frontend/src/services/news.js
// DESKRIPSI: News service
// =====================================================

import api from './api';

const newsService = {
  /**
   * Get all news
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/news', { params });
      return { 
        success: true, 
        data: response.data,
        pagination: response.pagination 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news by slug
   */
  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/news/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create news (Admin/PMI only)
   */
  create: async (newsData) => {
    try {
      const response = await api.post('/news', newsData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update news (Admin/PMI only)
   */
  update: async (id, newsData) => {
    try {
      const response = await api.put(`/news/${id}`, newsData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete news (Admin/PMI only)
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/news/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload news image
   */
  uploadImage: async (id, file, onProgress = null) => {
    try {
      const response = await api.upload(`/news/${id}/image`, file, 'news_image', {}, onProgress);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/news/categories');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get featured news
   */
  getFeatured: async () => {
    try {
      const response = await api.get('/news/featured');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Search news
   */
  search: async (keyword, params = {}) => {
    try {
      const response = await api.get('/news/search', { 
        params: { q: keyword, ...params } 
      });
      return { 
        success: true, 
        data: response.data,
        pagination: response.pagination 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get latest news
   */
  getLatest: async (limit = 5) => {
    try {
      const response = await api.get('/news/latest', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get popular news
   */
  getPopular: async (limit = 5) => {
    try {
      const response = await api.get('/news/popular', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news by author
   */
  getByAuthor: async (authorId, params = {}) => {
    try {
      const response = await api.get(`/news/author/${authorId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get related news
   */
  getRelated: async (newsId, limit = 3) => {
    try {
      const response = await api.get(`/news/${newsId}/related`, { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news archive
   */
  getArchive: async () => {
    try {
      const response = await api.get('/news/archive');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news by date
   */
  getByDate: async (year, month = null, day = null) => {
    try {
      const params = { year };
      if (month) params.month = month;
      if (day) params.day = day;
      
      const response = await api.get('/news/by-date', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/news/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Like news
   */
  like: async (id) => {
    try {
      const response = await api.post(`/news/${id}/like`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unlike news
   */
  unlike: async (id) => {
    try {
      const response = await api.delete(`/news/${id}/like`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Comment on news
   */
  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/news/${id}/comments`, { comment });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news comments
   */
  getComments: async (id, params = {}) => {
    try {
      const response = await api.get(`/news/${id}/comments`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete comment
   */
  deleteComment: async (newsId, commentId) => {
    try {
      const response = await api.delete(`/news/${newsId}/comments/${commentId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Share news
   */
  share: async (id, platform) => {
    try {
      const response = await api.post(`/news/${id}/share`, { platform });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get news feed
   */
  getFeed: async (params = {}) => {
    try {
      const response = await api.get('/news/feed', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to newsletter
   */
  subscribe: async (email) => {
    try {
      const response = await api.post('/news/subscribe', { email });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: async (email) => {
    try {
      const response = await api.post('/news/unsubscribe', { email });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default newsService;