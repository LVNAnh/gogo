// src/components/layout/Header.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ userType = "customer" }) => {
  const location = useLocation();

  // Hàm kiểm tra route hiện tại để highlight menu item
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to={`/${userType}`}>
          <img src="/logo.svg" alt="Logo" />
          <span>RideApp</span>
        </Link>
      </div>

      <nav className="main-nav">
        {userType === "customer" ? (
          <ul>
            <li>
              <Link
                to="/customer"
                className={isActive("/customer") ? "active" : ""}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/customer/book-ride"
                className={isActive("/customer/book-ride") ? "active" : ""}
              >
                Đặt xe
              </Link>
            </li>
            <li>
              <Link
                to="/customer/ride-history"
                className={isActive("/customer/ride-history") ? "active" : ""}
              >
                Lịch sử
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link
                to="/driver"
                className={isActive("/driver") ? "active" : ""}
              >
                Bảng điều khiển
              </Link>
            </li>
            <li>
              <Link
                to="/driver/ride-requests"
                className={isActive("/driver/ride-requests") ? "active" : ""}
              >
                Yêu cầu
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="user-actions">
        <div className="user-info">
          <span className="user-name">
            {userType === "customer" ? "Khách hàng" : "Tài xế"}
          </span>
        </div>
        <div className="switch-mode">
          <Link to={userType === "customer" ? "/driver" : "/customer"}>
            Chuyển sang {userType === "customer" ? "tài xế" : "khách hàng"}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
