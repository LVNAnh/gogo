// src/components/ride/RideStatusCard.js
import React from "react";
import { useRide } from "../../contexts/RideContext";

const RideStatusCard = () => {
  const { currentRide, rideStatus, estimatedPrice, estimatedTime, cancelRide } =
    useRide();

  if (!currentRide && rideStatus === "idle") return null;

  if (rideStatus === "searching") {
    return (
      <div className="ride-status-card searching">
        <div className="status-header">
          <h3>Đang tìm tài xế...</h3>
        </div>
        <div className="progress-indicator">
          <div className="spinner"></div>
        </div>
        <div className="action-buttons">
          <button className="cancel-btn" onClick={cancelRide}>
            Hủy
          </button>
        </div>
      </div>
    );
  }

  if (rideStatus === "confirmed" || rideStatus === "inProgress") {
    return (
      <div className="ride-status-card confirmed">
        <div className="status-header">
          <h3>
            {rideStatus === "confirmed"
              ? "Tài xế đang đến"
              : "Đang trong chuyến đi"}
          </h3>
        </div>
        <div className="driver-info">
          <div className="driver-avatar">
            <img src="/driver-avatar.svg" alt="Driver" />
          </div>
          <div className="driver-details">
            <h4>{currentRide.driver.name}</h4>
            <p>
              {currentRide.driver.vehicleInfo.model} -{" "}
              {currentRide.driver.vehicleInfo.plate}
            </p>
            <div className="rating">⭐ {currentRide.driver.rating}</div>
          </div>
          <div className="driver-contact">
            <button className="call-btn">Gọi</button>
            <button className="message-btn">Nhắn tin</button>
          </div>
        </div>
        <div className="ride-details">
          <div className="eta">
            <h4>Thời gian ước tính</h4>
            <p>{estimatedTime} phút</p>
          </div>
          <div className="price">
            <h4>Giá chuyến đi</h4>
            <p>{estimatedPrice?.toLocaleString("vi-VN")} VNĐ</p>
          </div>
        </div>
        {rideStatus === "confirmed" && (
          <div className="action-buttons">
            <button className="cancel-btn" onClick={cancelRide}>
              Hủy chuyến
            </button>
          </div>
        )}
      </div>
    );
  }

  if (rideStatus === "completed") {
    return (
      <div className="ride-status-card completed">
        <div className="status-header">
          <h3>Chuyến đi đã hoàn thành</h3>
        </div>
        <div className="ride-summary">
          <div className="price-paid">
            <h4>Giá trị chuyến đi</h4>
            <p>{estimatedPrice?.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <div className="ride-rating">
            <h4>Đánh giá tài xế</h4>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="star">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button className="primary-btn">Hoàn tất</button>
        </div>
      </div>
    );
  }

  return null;
};

export default RideStatusCard;
