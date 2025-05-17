// src/pages/auth/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const validateForm = () => {
    if (
      !formData.fullname ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại không hợp lệ (10 chữ số)");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const { confirmPassword, ...registerData } = formData;

      await register(registerData, formData.role);

      // Chuyển đến trang đăng nhập sau khi đăng ký thành công
      navigate("/login", {
        state: {
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
          role: formData.role,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng ký</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Họ và tên</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <div className="form-group">
            <label>Đăng ký với vai trò</label>
            <div className="role-toggle">
              <label
                className={`role-option ${
                  formData.role === "customer" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === "customer"}
                  onChange={() => handleRoleChange("customer")}
                />
                <span>Khách hàng</span>
              </label>
              <label
                className={`role-option ${
                  formData.role === "driver" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData.role === "driver"}
                  onChange={() => handleRoleChange("driver")}
                />
                <span>Tài xế</span>
              </label>
            </div>
          </div>

          {formData.role === "driver" && (
            <div className="driver-note">
              <p>
                <strong>Lưu ý:</strong> Để đăng ký làm tài xế, bạn sẽ cần cung
                cấp thêm thông tin về phương tiện và giấy tờ sau khi tạo tài
                khoản.
              </p>
            </div>
          )}

          <div className="form-action">
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <div className="login-link">
            Đã có tài khoản?{" "}
            <Link to="/login" className="link">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
