// src/components/layout/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © {new Date().getFullYear()} RideApp. All rights reserved.
        </div>
        <div className="footer-links">
          <a href="/terms">Điều khoản</a>
          <a href="/privacy">Chính sách</a>
          <a href="/help">Trợ giúp</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
