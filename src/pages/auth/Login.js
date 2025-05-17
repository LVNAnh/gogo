// src/pages/auth/Login.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy redirect URL từ location state hoặc mặc định theo role
  const from =
    location.state?.from || (role === "customer" ? "/customer" : "/driver");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await login(email, password, role);

      // Chuyển hướng sau khi đăng nhập thành công
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng nhập</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label>Vai trò</label>
            <div className="role-toggle">
              <label
                className={`role-option ${role === "customer" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                <span>Khách hàng</span>
              </label>
              <label
                className={`role-option ${role === "driver" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={role === "driver"}
                  onChange={() => setRole("driver")}
                />
                <span>Tài xế</span>
              </label>
            </div>
          </div>

          <div className="form-action">
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="link">
            Quên mật khẩu?
          </Link>
          <div className="register-link">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="link">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
