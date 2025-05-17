// src/pages/driver/ActiveRide.js
import React, { useState, useEffect } from "react";
import GoongMap from "../../components/map/GoongMap";
import UserMarker from "../../components/map/UserMarker";
import RoutePolyline from "../../components/map/RoutePolyline";
import useCurrentLocation from "../../hooks/useCurrentLocation";

const ActiveRide = () => {
  const { location: driverLocation } = useCurrentLocation();
  const [rideStatus, setRideStatus] = useState("driving_to_pickup"); // driving_to_pickup, arrived_at_pickup, driving_to_destination, arrived_at_destination
  const [rideInfo, setRideInfo] = useState({
    id: "ride-" + Date.now(),
    customerName: "Lê Thị D",
    customerPhone: "0987654321",
    pickup: [105.84191, 21.029],
    destination: [105.83091, 21.038],
    pickupAddress: "Vincom Center Bà Triệu",
    destinationAddress: "Lotte Center Hanoi",
    amount: 75000,
  });

  // Mô phỏng các bước của chuyến đi
  useEffect(() => {
    if (rideStatus === "driving_to_pickup") {
      const timer = setTimeout(() => {
        setRideStatus("arrived_at_pickup");
      }, 15000); // Sau 15 giây sẽ đến điểm đón
      return () => clearTimeout(timer);
    }

    if (rideStatus === "driving_to_destination") {
      const timer = setTimeout(() => {
        setRideStatus("arrived_at_destination");
      }, 30000); // Sau 30 giây sẽ đến điểm đến
      return () => clearTimeout(timer);
    }
  }, [rideStatus]);

  const startRide = () => {
    setRideStatus("driving_to_destination");
  };

  const completeRide = () => {
    // Trong thực tế sẽ gửi API để hoàn thành chuyến đi
    alert("Chuyến đi đã hoàn thành!");
    // Redirect to dashboard
    window.location.href = "/driver/dashboard";
  };

  return (
    <div className="active-ride-container">
      <div className="map-container">
        {driverLocation && (
          <GoongMap userLocation={driverLocation}>
            <UserMarker position={driverLocation} />
            <UserMarker
              position={
                rideStatus === "driving_to_pickup" ||
                rideStatus === "arrived_at_pickup"
                  ? rideInfo.pickup
                  : rideInfo.destination
              }
            />
            <RoutePolyline
              origin={driverLocation}
              destination={
                rideStatus === "driving_to_pickup" ||
                rideStatus === "arrived_at_pickup"
                  ? rideInfo.pickup
                  : rideInfo.destination
              }
            />
          </GoongMap>
        )}
      </div>

      <div className="ride-info-panel">
        <div className="ride-status-card">
          <div className="status-header">
            <h3>
              {rideStatus === "driving_to_pickup" && "Đang tới điểm đón"}
              {rideStatus === "arrived_at_pickup" && "Đã đến điểm đón"}
              {rideStatus === "driving_to_destination" && "Đang tới điểm đến"}
              {rideStatus === "arrived_at_destination" && "Đã đến điểm đến"}
            </h3>
          </div>

          <div className="customer-info">
            <h4>{rideInfo.customerName}</h4>
            <div className="phone">{rideInfo.customerPhone}</div>
          </div>

          <div className="ride-info">
            <div className="locations">
              <div className="pickup">
                <span className="label">Điểm đón:</span>
                <span className="value">{rideInfo.pickupAddress}</span>
              </div>
              <div className="destination">
                <span className="label">Điểm đến:</span>
                <span className="value">{rideInfo.destinationAddress}</span>
              </div>
            </div>
          </div>

          <div className="ride-amount">
            <span className="label">Giá tiền:</span>
            <span className="value">
              {rideInfo.amount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>

          <div className="action-buttons">
            {rideStatus === "arrived_at_pickup" && (
              <button className="primary-btn" onClick={startRide}>
                Bắt đầu chuyến đi
              </button>
            )}

            {rideStatus === "arrived_at_destination" && (
              <button className="primary-btn" onClick={completeRide}>
                Hoàn thành chuyến đi
              </button>
            )}

            <button className="secondary-btn">Liên hệ hỗ trợ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRide;
