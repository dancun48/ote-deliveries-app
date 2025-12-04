// services/api.js
import axios from 'axios';

const getApiBaseUrl = () => {
  // Check for Vite environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if we're in production (deployed on Vercel)
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://otebackend.onrender.com/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🌐 Current hostname:', window.location.hostname);
console.log('🔍 Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ADD THIS for CORS with credentials
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
    console.log('📤 Making API request to:', config.baseURL + config.url);
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
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error: error.message
    });
    
    // Handle network errors specifically
    if (!error.response) {
      console.error('🌐 Network error - backend may be down or CORS issue');
      console.error('💡 Check if backend is running at:', API_BASE_URL);
    }
    
    // Only redirect to login on 401 errors
    if (error.response?.status === 401) {
      console.log('🔒 Authentication failed, clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api;