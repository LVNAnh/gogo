// src/pages/customer/BookRide.js
import React, { useEffect } from "react";
import GoongMap from "../../components/map/GoongMap";
import UserMarker from "../../components/map/UserMarker";
import DriverMarker from "../../components/map/DriverMarker";
import RoutePolyline from "../../components/map/RoutePolyline";
import LocationSearch from "../../components/ride/LocationSearch";
import RideOptions from "../../components/ride/RideOptions";
import RideStatusCard from "../../components/ride/RideStatusCard";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { useRide } from "../../contexts/RideContext";

const BookRide = () => {
  const { location: userLocation, loading, error } = useCurrentLocation();
  const {
    pickupLocation,
    setPickupLocation,
    destination,
    currentRide,
    rideStatus,
    estimatedPrice,
    requestRide,
    driverLocation,
    allDrivers,
    loadingDrivers,
  } = useRide();

  // Khi có vị trí hiện tại, đặt làm điểm đón mặc định
  useEffect(() => {
    if (userLocation && !pickupLocation) {
      setPickupLocation(userLocation);
    }
  }, [userLocation, pickupLocation, setPickupLocation]);

  return (
    <div className="book-ride-container">
      <div className="map-container">
        {loading || loadingDrivers ? (
          <div className="loading-indicator">
            Đang tải bản đồ và vị trí tài xế...
          </div>
        ) : error ? (
          <div className="error-message">Có lỗi khi tải bản đồ: {error}</div>
        ) : (
          <GoongMap userLocation={pickupLocation || userLocation}>
            {/* Hiển thị điểm đón và điểm đến của người dùng */}
            {pickupLocation && <UserMarker position={pickupLocation} />}
            {destination && <UserMarker position={destination} />}

            {/* Hiển thị vị trí tài xế đã được phân công cho chuyến đi */}
            {driverLocation && rideStatus !== "idle" && (
              <DriverMarker position={driverLocation} isAssigned={true} />
            )}

            {/* Hiển thị tất cả tài xế có sẵn (chỉ khi không có chuyến đi nào đang diễn ra) */}
            {rideStatus === "idle" &&
              allDrivers &&
              allDrivers.map((driver) => (
                <DriverMarker
                  key={driver.id}
                  position={[driver.location.lng, driver.location.lat]}
                  driverName={driver.name}
                  isAssigned={false}
                />
              ))}

            {/* Hiển thị tuyến đường từ điểm đón đến điểm đến */}
            {pickupLocation && destination && (
              <RoutePolyline
                origin={pickupLocation}
                destination={destination}
              />
            )}

            {/* Hiển thị tuyến đường từ tài xế đến điểm đón (khi đã xác nhận chuyến đi) */}
            {driverLocation && pickupLocation && rideStatus === "confirmed" && (
              <RoutePolyline
                origin={driverLocation}
                destination={pickupLocation}
              />
            )}

            {/* Hiển thị tuyến đường từ tài xế đến điểm đến (khi đang trong chuyến đi) */}
            {driverLocation && destination && rideStatus === "inProgress" && (
              <RoutePolyline
                origin={driverLocation}
                destination={destination}
              />
            )}
          </GoongMap>
        )}
      </div>

      <div className="ride-booking-panel">
        {rideStatus === "idle" ? (
          <>
            <LocationSearch />
            {pickupLocation && destination && <RideOptions />}
            {estimatedPrice && (
              <div className="booking-action">
                <button
                  className="primary-btn"
                  onClick={requestRide}
                  disabled={loadingDrivers || allDrivers.length === 0}
                >
                  {loadingDrivers
                    ? "Đang tải vị trí tài xế..."
                    : allDrivers.length === 0
                    ? "Không có tài xế"
                    : "Đặt xe ngay"}
                </button>
              </div>
            )}
          </>
        ) : (
          <RideStatusCard />
        )}
      </div>
    </div>
  );
};

export default BookRide;
