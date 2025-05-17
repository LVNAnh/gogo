// src/services/api.js
import axios from "axios";

// Đặt URL cơ sở cho API
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn, đăng xuất người dùng
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints cho khách hàng
export const customerAPI = {
  // Lấy thông tin khách hàng
  getProfile: () => api.get("/customer/profile"),

  // Tạo yêu cầu chuyến đi mới
  createRideRequest: (data) => api.post("/customer/ride-request", data),

  // Hủy yêu cầu chuyến đi
  cancelRideRequest: (rideId) =>
    api.post(`/customer/ride-request/${rideId}/cancel`),

  // Lấy lịch sử chuyến đi
  getRideHistory: (page = 1, limit = 10) =>
    api.get(`/customer/ride-history?page=${page}&limit=${limit}`),

  // Đánh giá chuyến đi
  rateRide: (rideId, rating, comment) =>
    api.post(`/customer/ride/${rideId}/rate`, { rating, comment }),

  // Báo cáo vấn đề về chuyến đi
  reportIssue: (rideId, issueType, description) =>
    api.post(`/customer/ride/${rideId}/report`, { issueType, description }),
};

// API endpoints cho tài xế
export const driverAPI = {
  // Lấy thông tin tài xế
  getProfile: () => api.get("/driver/profile"),

  // Cập nhật trạng thái hoạt động
  updateStatus: (isOnline) => api.post("/driver/status", { isOnline }),

  // Cập nhật vị trí
  updateLocation: (latitude, longitude) =>
    api.post("/driver/location", { latitude, longitude }),

  // Chấp nhận yêu cầu chuyến đi
  acceptRideRequest: (requestId) =>
    api.post(`/driver/ride-request/${requestId}/accept`),

  // Từ chối yêu cầu chuyến đi
  declineRideRequest: (requestId) =>
    api.post(`/driver/ride-request/${requestId}/decline`),

  // Bắt đầu chuyến đi
  startRide: (rideId) => api.post(`/driver/ride/${rideId}/start`),

  // Hoàn thành chuyến đi
  completeRide: (rideId) => api.post(`/driver/ride/${rideId}/complete`),

  // Lấy lịch sử chuyến đi
  getRideHistory: (page = 1, limit = 10) =>
    api.get(`/driver/ride-history?page=${page}&limit=${limit}`),

  // Lấy thống kê thu nhập
  getEarnings: (period = "day") => api.get(`/driver/earnings?period=${period}`),
};

// API endpoints cho xác thực
export const authAPI = {
  // Đăng nhập
  login: (email, password, role) =>
    api.post("/auth/login", { email, password, role }),

  // Đăng ký
  register: (userData, role) =>
    api.post("/auth/register", { ...userData, role }),

  // Refresh token
  refreshToken: () => api.post("/auth/refresh-token"),

  // Quên mật khẩu
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Đặt lại mật khẩu
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

export default api;
