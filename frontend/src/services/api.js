// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' || 'https://otebackend.onrender.com/api';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Adding token to request');
    }
    console.log('📤 Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Only redirect to login on 401 errors, not on network errors
    if (error.response?.status === 401) {
      console.log('🔒 Authentication failed, clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically - let the component handle it
      console.log('⚠️ Token invalid, should redirect to login');
    }
    
    return Promise.reject(error);
  }
);

export default api;