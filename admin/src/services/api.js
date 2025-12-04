import axios from 'axios';

const getApiBaseUrl = () => {
  // Priority 1: Vite environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Priority 2: Check if we're on Vercel (production)
  if (window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('oteadmin.vercel.app')) {
    return 'https://otebackend.onrender.com/api';
  }
  
  // Priority 3: Development - localhost
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 Admin API Base URL:', API_BASE_URL);
console.log('🌐 Current hostname:', window.location.hostname);
console.log('🔍 Environment mode:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT for CORS with cookies/tokens
  timeout: 15000, // Increased timeout for Render
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Adding admin token to request');
    }
    console.log('📤 Admin API request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Admin request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Admin API response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Admin API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error: error.message
    });
    
    // Special handling for network errors
    if (!error.response) {
      console.error('🌐 Network error - Check:');
      console.error('1. Is backend running at:', API_BASE_URL);
      console.error('2. CORS configuration on backend');
      console.error('3. Network connectivity');
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔒 Admin authentication failed, clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use setTimeout to avoid redirect during render
      setTimeout(() => {
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

export default api;