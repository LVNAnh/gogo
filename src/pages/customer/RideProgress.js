// src/pages/customer/RideProgress.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoongMap from "../../components/map/GoongMap";
import UserMarker from "../../components/map/UserMarker";
import DriverMarker from "../../components/map/DriverMarker";
import RoutePolyline from "../../components/map/RoutePolyline";
import RideStatusCard from "../../components/ride/RideStatusCard";
import useDriverLocation from "../../hooks/useDriverLocation";
import { useRide } from "../../contexts/RideContext";

const RideProgress = () => {
  const navigate = useNavigate();
  const { currentRide, rideStatus, pickupLocation, destination, completeRide } =
    useRide();

  const { driverLocation, driverRotation } = useDriverLocation(currentRide?.id);

  // Redirect if no active ride
  useEffect(() => {
    if (!currentRide || rideStatus === "idle") {
      navigate("/customer/book-ride");
    }
  }, [currentRide, rideStatus, navigate]);

  // Simulate ride completion after some time (in real app this would come from backend)
  useEffect(() => {
    if (rideStatus === "inProgress") {
      const timer = setTimeout(() => {
        completeRide();
      }, 60000); // 1 minute for demo purposes

      return () => clearTimeout(timer);
    }
  }, [rideStatus, completeRide]);

  return (
    <div className="ride-progress-container">
      <div className="map-container">
        <GoongMap userLocation={pickupLocation}>
          {pickupLocation && <UserMarker position={pickupLocation} />}
          {destination && <UserMarker position={destination} />}
          {driverLocation && (
            <DriverMarker position={driverLocation} rotation={driverRotation} />
          )}
          {driverLocation && destination && (
            <RoutePolyline
              origin={driverLocation}
              destination={
                rideStatus === "confirmed" ? pickupLocation : destination
              }
            />
          )}
        </GoongMap>
      </div>

      <div className="ride-status-panel">
        <RideStatusCard />
      </div>
    </div>
  );
};

export default RideProgress;
