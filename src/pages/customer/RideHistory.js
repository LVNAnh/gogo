// src/pages/customer/RideHistory.js
import React, { useState, useEffect } from "react";
import { customerAPI } from "../../services/api";

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRideHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Mô phỏng API call để lấy lịch sử chuyến đi
      // Trong thực tế, bạn sẽ gọi customerAPI.getRideHistory(page)
      const mockData = {
        rides: [
          {
            id: "ride-101",
            date: "2023-05-15T08:30:00Z",
            pickup: "Keangnam Landmark Tower",
            destination: "Times City",
            driver: {
              name: "Nguyễn Văn A",
              rating: 4.8,
            },
            status: "completed",
            amount: 125000,
            distance: 8.5,
            duration: 25,
          },
          {
            id: "ride-102",
            date: "2023-05-10T14:15:00Z",
            pickup: "Royal City",
            destination: "Nội Bài Airport",
            driver: {
              name: "Trần Văn B",
              rating: 4.6,
            },
            status: "completed",
            amount: 320000,
            distance: 27.3,
            duration: 45,
          },
          {
            id: "ride-103",
            date: "2023-05-05T19:00:00Z",
            pickup: "Lotte Center Hanoi",
            destination: "Vincom Center Bà Triệu",
            driver: {
              name: "Lê Thị C",
              rating: 4.9,
            },
            status: "completed",
            amount: 75000,
            distance: 4.2,
            duration: 15,
          },
        ],
        totalPages: 2,
        currentPage: page,
      };

      // Đặt thời gian giả lập loading
      setTimeout(() => {
        setRides(mockData.rides);
        setTotalPages(mockData.totalPages);
        setCurrentPage(mockData.currentPage);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Không thể tải lịch sử chuyến đi. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideHistory(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="ride-history-container">
      <div className="page-header">
        <h1>Lịch sử chuyến đi</h1>
      </div>

      {loading ? (
        <div className="loading-indicator">Đang tải lịch sử chuyến đi...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : rides.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có chuyến đi nào.</p>
        </div>
      ) : (
        <>
          <div className="rides-table">
            <div className="table-header">
              <div className="header-cell date">Ngày</div>
              <div className="header-cell route">Lộ trình</div>
              <div className="header-cell driver">Tài xế</div>
              <div className="header-cell details">Chi tiết</div>
              <div className="header-cell amount">Giá tiền</div>
            </div>

            {rides.map((ride) => (
              <div key={ride.id} className="table-row">
                <div className="cell date">{formatDate(ride.date)}</div>
                <div className="cell route">
                  <div className="pickup">{ride.pickup}</div>
                  <div className="destination">{ride.destination}</div>
                </div>
                <div className="cell driver">
                  <div>{ride.driver.name}</div>
                  <div className="rating">⭐ {ride.driver.rating}</div>
                </div>
                <div className="cell details">
                  <div>{ride.distance} km</div>
                  <div>{ride.duration} phút</div>
                </div>
                <div className="cell amount">
                  {ride.amount.toLocaleString("vi-VN")} VNĐ
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Trước
            </button>
            <span className="page-info">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RideHistory;
