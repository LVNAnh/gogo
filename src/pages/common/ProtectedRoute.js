// src/components/common/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading trong khi kiểm tra xác thực
  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  // Kiểm tra người dùng đã đăng nhập chưa
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra vai trò nếu cần
  if (requiredRole && user.role !== requiredRole) {
    // Chuyển hướng về trang chính của vai trò hiện tại
    const defaultPath = user.role === "customer" ? "/customer" : "/driver";
    return <Navigate to={defaultPath} replace />;
  }

  // Nếu đã đăng nhập và có đúng vai trò, hiển thị nội dung được bảo vệ
  return children;
};

export default ProtectedRoute;
