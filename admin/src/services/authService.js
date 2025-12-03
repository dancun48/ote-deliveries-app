// services/authService.js
import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 Admin login attempt for:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      // If login successful, store token
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token); // Use 'token' not 'admin_token'
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('👤 Fetching current admin user');
      
      // Check if token exists
      const token = localStorage.getItem('token'); // Use 'token' not 'admin_token'
      console.log('🔑 Token exists:', !!token);
      
      const response = await api.get('/auth/me');
      console.log('✅ Current user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      
      // Clear auth data on 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Use 'token' not 'admin_token'
        localStorage.removeItem('user'); // Use 'user' not 'admin_user'
      }
      
      throw error;
    }
  }
};