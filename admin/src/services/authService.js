// services/authService.js
import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 Admin login attempt for:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('👤 Fetching current admin user');
      const response = await api.get('/auth/me');
      console.log('✅ Current user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw error;
    }
  }
};