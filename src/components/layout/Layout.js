// src/components/layout/Layout.js
import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ userType = "customer" }) => {
  return (
    <div className={`app-layout ${userType}-layout`}>
      <Header userType={userType} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
