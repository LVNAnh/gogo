// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/auth";
import SocketService from "../services/socket";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi khởi động
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = AuthService.getUser();
        if (storedUser) {
          setUser(storedUser);

          // Kết nối socket nếu đã đăng nhập
          const token = AuthService.getToken();
          if (token) {
            SocketService.connect(token);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Đăng nhập
  const login = async (email, password, role) => {
    try {
      setError(null);
      setLoading(true);

      const loggedInUser = await AuthService.login(email, password, role);
      setUser(loggedInUser);

      // Kết nối socket sau khi đăng nhập
      const token = AuthService.getToken();
      if (token) {
        SocketService.connect(token);
      }

      return loggedInUser;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký
  const register = async (userData, role) => {
    try {
      setError(null);
      setLoading(true);

      const result = await AuthService.register(userData, role);
      return result;
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = () => {
    AuthService.logout();
    setUser(null);

    // Ngắt kết nối socket khi đăng xuất
    SocketService.disconnect();
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
