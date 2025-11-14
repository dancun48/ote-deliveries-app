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
          const response = await authService.getCurrentUser();
          const user = response.data?.user || response.user;

          if (user && user.isAdmin) {
            console.log("✅ Valid admin user found:", user.email);
            setUser(user);

            // AUTO-CONNECT SOCKET ON PAGE RELOAD/REFRESH
            console.log("🔌 Auto-connecting WebSocket on auth check...");
            setTimeout(() => {
              socketService.connect();
            }, 1000);
          } else {
            console.log("❌ User is not admin or invalid data");
            clearAuthData();
          }
        } catch (error) {
          console.error("❌ Token validation failed:", error);
          clearAuthData();
        }
      } else {
        console.log("⚠️ No auth data found");
        clearAuthData();
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

      if (response.success && response.data?.token) {
        const token = response.data.token;
        const user = response.data.user;

        // Check if user is admin
        if (!user.isAdmin) {
          console.log("❌ Access denied - user is not admin");
          return {
            success: false,
            message: "Access denied. Admin privileges required.",
          };
        }

        console.log("✅ Admin login successful");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        // AUTO-CONNECT SOCKET AFTER LOGIN
        console.log("🔌 Auto-connecting WebSocket after login...");
        socketService.connect();

        return { success: true, user };
      } else {
        const errorMessage = response.message || "Login failed";
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
