// src/pages/driver/Dashboard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoongMap from "../../components/map/GoongMap";
import UserMarker from "../../components/map/UserMarker";
import useCurrentLocation from "../../hooks/useCurrentLocation";

const DriverDashboard = () => {
  const { location: driverLocation } = useCurrentLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState({
    today: 250000,
    week: 1750000,
    month: 7500000,
  });

  const [recentRides, setRecentRides] = useState([
    {
      id: "ride-1",
      customerName: "Trần Văn B",
      pickup: "Keangnam Landmark Tower",
      destination: "Times City",
      time: "14:30",
      amount: 125000,
    },
    {
      id: "ride-2",
      customerName: "Nguyễn Thị C",
      pickup: "Royal City",
      destination: "Nội Bài Airport",
      time: "12:15",
      amount: 320000,
    },
  ]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // Trong thực tế, sẽ gửi trạng thái này lên server
  };

  return (
    <div className="driver-dashboard-container">
      <div className="status-bar">
        <div className={`online-status ${isOnline ? "online" : "offline"}`}>
          <span className="status-indicator"></span>
          <span className="status-text">
            {isOnline ? "Đang online" : "Offline"}
          </span>
        </div>
        <button
          className={`toggle-status-btn ${isOnline ? "online" : "offline"}`}
          onClick={toggleOnlineStatus}
        >
          {isOnline ? "Offline" : "Online"}
        </button>
      </div>

      <div className="map-container">
        {driverLocation ? (
          <GoongMap userLocation={driverLocation}>
            <UserMarker position={driverLocation} />
          </GoongMap>
        ) : (
          <div className="loading-map">Đang tải bản đồ...</div>
        )}
      </div>

      <div className="earnings-summary">
        <h2>Thu nhập</h2>
        <div className="earnings-grid">
          <div className="earning-card">
            <span className="label">Hôm nay</span>
            <span className="amount">
              {earnings.today.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="earning-card">
            <span className="label">Tuần này</span>
            <span className="amount">
              {earnings.week.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="earning-card">
            <span className="label">Tháng này</span>
            <span className="amount">
              {earnings.month.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
        </div>
      </div>

      <div className="recent-rides">
        <h2>Chuyến đi gần đây</h2>
        <div className="rides-list">
          {recentRides.map((ride) => (
            <div key={ride.id} className="ride-item">
              <div className="customer-info">
                <h4>{ride.customerName}</h4>
                <span className="time">{ride.time}</span>
              </div>
              <div className="ride-route">
                <div className="pickup">{ride.pickup}</div>
                <div className="destination">{ride.destination}</div>
              </div>
              <div className="ride-amount">
                {ride.amount.toLocaleString("vi-VN")} VNĐ
              </div>
            </div>
          ))}
        </div>
        <Link to="/driver/ride-history" className="view-all-link">
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default DriverDashboard;
