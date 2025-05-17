// src/pages/common/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Trang không tìm thấy</h2>
        <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/" className="primary-btn">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
