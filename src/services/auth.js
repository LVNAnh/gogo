// src/services/auth.js
import { authAPI } from "./api";

// Service cho quản lý xác thực và quyền truy cập
const AuthService = {
  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem("token", token);
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Xóa token khỏi localStorage (đăng xuất)
  removeToken: () => {
    localStorage.removeItem("token");
  },

  // Lưu thông tin người dùng vào localStorage
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Lấy thông tin người dùng từ localStorage
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Xóa thông tin người dùng khỏi localStorage
  removeUser: () => {
    localStorage.removeItem("user");
  },

  // Đăng nhập
  login: async (email, password, role) => {
    try {
      const response = await authAPI.login(email, password, role);
      const { token, user } = response.data;

      AuthService.setToken(token);
      AuthService.setUser(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    AuthService.removeToken();
    AuthService.removeUser();
  },

  // Đăng ký
  register: async (userData, role) => {
    try {
      const response = await authAPI.register(userData, role);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Kiểm tra người dùng đã đăng nhập chưa
  isAuthenticated: () => {
    return !!AuthService.getToken();
  },

  // Lấy vai trò của người dùng
  getUserRole: () => {
    const user = AuthService.getUser();
    return user ? user.role : null;
  },

  // Yêu cầu đặt lại mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};

export default AuthService;
