// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RideProvider } from "./contexts/RideContext";

// Layouts
import Layout from "./components/layout/Layout";

// Customer Pages
import CustomerHome from "./pages/customer/Home";
import BookRide from "./pages/customer/BookRide";
import RideProgress from "./pages/customer/RideProgress";
import RideHistory from "./pages/customer/RideHistory";

// Driver Pages
import DriverDashboard from "./pages/driver/Dashboard";
import RideRequests from "./pages/driver/RideRequests";
import ActiveRide from "./pages/driver/ActiveRide";

// Common Pages
import NotFound from "./pages/common/NotFound";

import "./App.css";

function App() {
  return (
    <Router>
      <RideProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/customer" element={<Layout userType="customer" />}>
            <Route index element={<CustomerHome />} />
            <Route path="book-ride" element={<BookRide />} />
            <Route path="ride-progress" element={<RideProgress />} />
            <Route path="ride-history" element={<RideHistory />} />
          </Route>

          {/* Driver Routes */}
          <Route path="/driver" element={<Layout userType="driver" />}>
            <Route index element={<DriverDashboard />} />
            <Route path="ride-requests" element={<RideRequests />} />
            <Route path="active-ride" element={<ActiveRide />} />
          </Route>

          {/* Redirect root to customer home */}
          <Route path="/" element={<Navigate to="/customer" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RideProvider>
    </Router>
  );
}

export default App;
