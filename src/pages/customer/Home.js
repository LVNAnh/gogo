// src/pages/customer/Home.js
import React from "react";
import { Link } from "react-router-dom";

const CustomerHome = () => {
  return (
    <div className="customer-home-container">
      <div className="hero-section">
        <h1>Di chuyển dễ dàng, nhanh chóng</h1>
        <p>Đặt xe ngay để trải nghiệm dịch vụ của chúng tôi</p>
      </div>

      <div className="cta-buttons">
        <Link to="/customer/book-ride" className="primary-btn">
          Đặt xe ngay
        </Link>
        <Link to="/customer/ride-history" className="secondary-btn">
          Lịch sử chuyến đi
        </Link>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3>Nhanh chóng</h3>
          <p>Tài xế luôn sẵn sàng trong khu vực của bạn</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Giá cả phải chăng</h3>
          <p>Giá cả minh bạch, không phụ thu</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Chất lượng cao</h3>
          <p>Tài xế được đánh giá và lựa chọn kỹ càng</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
