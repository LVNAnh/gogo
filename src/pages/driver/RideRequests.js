// src/pages/driver/RideRequests.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoongMap from "../../components/map/GoongMap";
import UserMarker from "../../components/map/UserMarker";
import RoutePolyline from "../../components/map/RoutePolyline";
import useCurrentLocation from "../../hooks/useCurrentLocation";

const RideRequests = () => {
  const navigate = useNavigate();
  const { location: driverLocation } = useCurrentLocation();
  const [rideRequests, setRideRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Mô phỏng nhận yêu cầu chuyến đi mới
  useEffect(() => {
    // Trong thực tế, sẽ sử dụng socket.io để nhận yêu cầu mới
    const timer = setTimeout(() => {
      const newRequest = {
        id: "req-" + Date.now(),
        customerName: "Lê Thị D",
        customerRating: 4.7,
        pickup: [105.84191, 21.029], // Tọa độ điểm đón
        destination: [105.83091, 21.038], // Tọa độ điểm đến
        pickupAddress: "Vincom Center Bà Triệu",
        destinationAddress: "Lotte Center Hanoi",
        estimatedAmount: 75000,
        estimatedDistance: 2.5,
        estimatedDuration: 12,
      };

      setRideRequests([newRequest]);
      setSelectedRequest(newRequest);
      setCountdown(15); // 15 giây để chấp nhận
    }, 5000); // Sau 5 giây sẽ hiện yêu cầu mới

    return () => clearTimeout(timer);
  }, []);

  // Đếm ngược thời gian chấp nhận
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      // Hết thời gian
      setRideRequests((requests) =>
        requests.filter((req) => req.id !== selectedRequest.id)
      );
      setSelectedRequest(null);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, selectedRequest]);

  const acceptRide = (requestId) => {
    // Trong thực tế, sẽ gửi API để chấp nhận chuyến đi
    console.log(`Accepted ride request: ${requestId}`);
    // Chuyển đến trang chuyến đi đang hoạt động
    navigate("/driver/active-ride");
  };

  const declineRide = (requestId) => {
    setRideRequests((requests) =>
      requests.filter((req) => req.id !== requestId)
    );
    setSelectedRequest(null);
    setCountdown(null);
  };

  return (
    <div className="ride-requests-container">
      <div className="map-container">
        {driverLocation && (
          <GoongMap userLocation={driverLocation}>
            <UserMarker position={driverLocation} />
            {selectedRequest && (
              <>
                <UserMarker position={selectedRequest.pickup} />
                <UserMarker position={selectedRequest.destination} />
                <RoutePolyline
                  origin={driverLocation}
                  destination={selectedRequest.pickup}
                />
              </>
            )}
          </GoongMap>
        )}
      </div>

      <div className="request-panel">
        {selectedRequest ? (
          <div className="ride-request-card">
            <div className="request-header">
              <h3>Yêu cầu chuyến đi mới</h3>
              <div className="countdown">{countdown}s</div>
            </div>

            <div className="customer-info">
              <h4>{selectedRequest.customerName}</h4>
              <div className="rating">⭐ {selectedRequest.customerRating}</div>
            </div>

            <div className="ride-info">
              <div className="locations">
                <div className="pickup">
                  <span className="label">Điểm đón:</span>
                  <span className="value">{selectedRequest.pickupAddress}</span>
                </div>
                <div className="destination">
                  <span className="label">Điểm đến:</span>
                  <span className="value">
                    {selectedRequest.destinationAddress}
                  </span>
                </div>
              </div>

              <div className="ride-details">
                <div className="distance">
                  <span className="label">Khoảng cách:</span>
                  <span className="value">
                    {selectedRequest.estimatedDistance} km
                  </span>
                </div>
                <div className="duration">
                  <span className="label">Thời gian:</span>
                  <span className="value">
                    {selectedRequest.estimatedDuration} phút
                  </span>
                </div>
                <div className="amount">
                  <span className="label">Giá tiền:</span>
                  <span className="value">
                    {selectedRequest.estimatedAmount.toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="accept-btn"
                onClick={() => acceptRide(selectedRequest.id)}
              >
                Chấp nhận
              </button>
              <button
                className="decline-btn"
                onClick={() => declineRide(selectedRequest.id)}
              >
                Từ chối
              </button>
            </div>
          </div>
        ) : (
          <div className="no-requests">
            <h3>Không có yêu cầu chuyến đi mới</h3>
            <p>Vui lòng đợi trong giây lát hoặc di chuyển đến khu vực khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideRequests;
