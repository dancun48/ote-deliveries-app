// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      console.log('🔐 Auth check on refresh:', {
        token: !!token,
        userData: !!userData
      });

      if (token && userData) {
        try {
          // Verify token is still valid
          const response = await authService.getCurrentUser();
          console.log('✅ Token validation response:', response);
          
          if (response.success) {
            const user = response.data?.user || response.user;
            if (user) {
              console.log('✅ User authenticated from token:', user.email);
              setUser(user);
              
              // Update localStorage with fresh user data
              localStorage.setItem('user', JSON.stringify(user));
            } else {
              console.log('❌ No user data in response');
              clearAuthData();
            }
          } else {
            console.log('❌ Token validation failed');
            clearAuthData();
          }
        } catch (error) {
          console.error('❌ Token validation error:', error);
          clearAuthData();
        }
      } else {
        console.log('⚠️ No auth tokens found in localStorage');
        clearAuthData();
      }
    } catch (error) {
      console.error('🚨 Auth check error:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      console.log("🔐 Starting login process...");
      const response = await authService.login(email, password);
      
      console.log("📨 Login API response:", response);
      
      if (response.success && response.data?.token) {
        const token = response.data.token;
        const user = response.data.user;
        
        // Store both token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        console.log("✅ Login successful, user set:", user.email);
        return { success: true, user };
      } else {
        const errorMessage = response.message || "Login failed - no token received";
        console.log("❌ Login failed:", errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("🚨 Login process error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      console.log("👤 Starting registration process...");
      const response = await authService.register(userData);
      
      console.log("📨 Registration API response:", response);
      
      if (response.success && response.data?.token) {
        const token = response.data.token;
        const user = response.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        console.log("✅ Registration successful, user set:", user.email);
        return { success: true, user };
      } else {
        const errorMessage = response.message || "Registration failed";
        console.log("❌ Registration failed:", errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("🚨 Registration process error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  const updateUser = (updatedUserData) => {
  console.log('🔄 Updating user context with new data:', updatedUserData);
  setUser(prevUser => ({
    ...prevUser,
    ...updatedUserData
  }));
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...currentUser, ...updatedUserData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
};

  const logout = () => {
    console.log("🚪 Logging out user");
    clearAuthData();
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};