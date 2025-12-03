import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import { socketService } from "../services/socketService";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

// Update the checkAuth function in AuthContext.jsx
const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("🔐 Admin Auth check:", {
      token: !!token,
      userData: !!userData,
    });

    if (token && userData) {
      try {
        // First parse the stored user data
        const storedUser = JSON.parse(userData);
        console.log("📝 Parsed stored user:", storedUser);
        
        // Check if user is admin
        const isAdmin = storedUser.isAdmin || storedUser.is_admin;
        
        if (isAdmin) {
          console.log("✅ Stored user is admin, validating with backend...");
          
          // Try to validate with backend
          try {
            const response = await authService.getCurrentUser();
            // Handle different response structures
            const validatedUser = response.data?.user || response.user || response.data || storedUser;
            
            // Update stored user with fresh data
            localStorage.setItem("user", JSON.stringify(validatedUser));
            setUser(validatedUser);
            
            console.log("✅ Backend validation successful:", validatedUser.email);
            
            // AUTO-CONNECT SOCKET
            console.log("🔌 Auto-connecting WebSocket...");
            setTimeout(() => {
              socketService.connect();
            }, 1000);
            
          } catch (validationError) {
            // If backend validation fails but we have valid stored data, use it
            console.warn("⚠️ Backend validation failed, using stored data:", validationError.message);
            setUser(storedUser);
          }
        } else {
          console.log("❌ Stored user is not admin");
          clearAuthData();
        }
      } catch (parseError) {
        console.error("❌ Error parsing stored user:", parseError);
        clearAuthData();
      }
    } else {
      console.log("⚠️ No auth data found in localStorage");
      setUser(null);
    }
  } catch (error) {
    console.error("🚨 Auth check error:", error);
    clearAuthData();
  } finally {
    setLoading(false);
  }
};

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

const login = async (email, password) => {
  try {
    console.log("🔐 Admin login attempt for:", email);
    const response = await authService.login(email, password);

    console.log("📨 Login API response:", response);

    // Handle different response structures
    const token = response.data?.token || response.token;
    const user = response.data?.user || response.user || response.data;

    if (token && user) {
      // Check if user is admin
      const isAdmin = user.isAdmin || user.is_admin;
      
      if (!isAdmin) {
        console.log("❌ Access denied - user is not admin");
        return {
          success: false,
          message: "Access denied. Admin privileges required.",
        };
      }

      console.log("✅ Admin login successful");

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Set auth token for future requests
      if (authService.setAuthToken) {
        authService.setAuthToken(token);
      }

      // AUTO-CONNECT SOCKET
      console.log("🔌 Auto-connecting WebSocket after login...");
      socketService.connect();

      return { success: true, user };
    } else {
      const errorMessage = response.message || "Login failed - no token or user received";
      console.log("❌ Login failed:", errorMessage);
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("🚨 Login process error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please check your credentials.";
    return { success: false, message: errorMessage };
  }
};

  const logout = () => {
    console.log("🚪 Logging out admin");
    
    // Clear auth header if exists
    if (authService.clearAuthToken) {
      authService.clearAuthToken();
    }
    
    socketService.disconnect();
    clearAuthData();
    window.location.href = "/login";
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};