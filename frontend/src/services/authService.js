// services/authService.js
import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 Login attempt for:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('👤 Registration attempt for:', userData.email);
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration service error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('👤 Fetching current user');
      const response = await api.get('/auth/me');
      console.log('✅ Current user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw error;
    }
  },
  
  async updateProfile(updateData) {
    try {
      const response = await api.put('/auth/me/profile', updateData);
      console.log('✅ Update profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile service error:', error);
      throw error;
    }
  }
};