// services/authService.js - Updated version
import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 Login attempt for:', email);
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success && response.data.data?.token) {
        // Store token for future requests
        const token = response.data.data.token;
        localStorage.setItem('authToken', token);
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No token available');
      }

      // Ensure Authorization header is set
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        return response.data.data.user;
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error) {
      console.error('❌ Get current user error:', error);
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};