// src/contexts/RideContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import driverService from "../services/driverService";

const RideContext = createContext();

export const useRide = () => useContext(RideContext);

export const RideProvider = ({ children }) => {
  const [currentRide, setCurrentRide] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideStatus, setRideStatus] = useState("idle"); // idle, searching, confirmed, inProgress, completed
  const [selectedVehicleType, setSelectedVehicleType] = useState("car");
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null); // Vị trí tài xế đã được phân công
  const [allDrivers, setAllDrivers] = useState([]); // Danh sách tất cả tài xế
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driversError, setDriversError] = useState(null);

  // Fetch danh sách tài xế khi component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        setDriversError(null);
        const driversData = await driverService.getAllDrivers();
        setAllDrivers(driversData);
      } catch (error) {
        setDriversError("Không thể tải danh sách tài xế");
        console.error("Error fetching drivers:", error);
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();

    // Thiết lập interval để cập nhật vị trí tài xế theo thời gian thực
    const driversInterval = setInterval(fetchDrivers, 10000); // Cập nhật mỗi 10 giây

    return () => clearInterval(driversInterval);
  }, []);

  // Tìm tài xế gần nhất để gán cho ride request
  const findNearestDriver = (pickup) => {
    if (!pickup || allDrivers.length === 0) return null;

    // Chuyển đổi định dạng [lng, lat] thành {lat, lng}
    const pickupLatLng = {
      lat: pickup[1],
      lng: pickup[0],
    };

    // Tính khoảng cách giữa 2 điểm
    const calculateDistance = (point1, point2) => {
      const latDiff = point1.lat - point2.lat;
      const lngDiff = point1.lng - point2.lng;
      return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    };

    // Tìm tài xế gần nhất
    let nearestDriver = null;
    let minDistance = Infinity;

    allDrivers.forEach((driver) => {
      const distance = calculateDistance(pickupLatLng, driver.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    });

    return nearestDriver;
  };

  // Yêu cầu đặt xe - giờ sẽ tìm tài xế gần nhất từ API
  const requestRide = async () => {
    try {
      setRideStatus("searching");

      // Tìm tài xế gần nhất từ danh sách đã fetch từ API
      const nearestDriver = findNearestDriver(pickupLocation);

      if (!nearestDriver) {
        throw new Error("Không tìm thấy tài xế gần bạn. Vui lòng thử lại sau.");
      }

      // Giả lập thời gian tìm tài xế
      setTimeout(() => {
        // Chuyển đổi vị trí tài xế từ đối tượng {lat, lng} thành mảng [lng, lat]
        const driverLoc = [
          nearestDriver.location.lng,
          nearestDriver.location.lat,
        ];
        setDriverLocation(driverLoc);

        const newRide = {
          id: "ride-" + Date.now(),
          driver: {
            id: nearestDriver.id,
            name: nearestDriver.name,
            phone: "0123456789", // Fake data vì API không cung cấp
            rating: 4.8, // Fake data vì API không cung cấp
            vehicleInfo: {
              type: selectedVehicleType,
              plate: "29A-12345", // Fake data
              model: "Toyota Vios", // Fake data
            },
          },
          pickup: pickupLocation,
          destination: destination,
          price: estimatedPrice,
          createdAt: new Date().toISOString(),
        };

        setCurrentRide(newRide);
        setRideStatus("confirmed");

        // Giả lập tài xế di chuyển đến điểm đón
        simulateDriverMovement(driverLoc, pickupLocation);
      }, 3000);
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert(error.message || "Có lỗi xảy ra khi đặt xe");
      setRideStatus("idle");
    }
  };

  // Giả lập di chuyển tài xế từ vị trí A đến B
  const simulateDriverMovement = (start, end) => {
    if (!start || !end) return;

    const steps = 10;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        const progress = currentStep / steps;
        const newLng = start[0] + (end[0] - start[0]) * progress;
        const newLat = start[1] + (end[1] - start[1]) * progress;

        setDriverLocation([newLng, newLat]);
      } else {
        clearInterval(interval);

        if (rideStatus === "confirmed") {
          // Khi tài xế đến điểm đón, đợi 3 giây rồi bắt đầu chuyến đi
          setTimeout(() => startRide(), 3000);
        }
      }
    }, 2000);
  };

  const cancelRide = () => {
    setCurrentRide(null);
    setRideStatus("idle");
    setDriverLocation(null);
  };

  const startRide = () => {
    setRideStatus("inProgress");

    // Giả lập tài xế di chuyển từ điểm đón đến điểm đến
    simulateDriverMovement(pickupLocation, destination);
  };

  const completeRide = () => {
    setRideStatus("completed");

    // Trong thực tế sẽ lưu vào database
    console.log("Ride completed:", {
      ...currentRide,
      completedAt: new Date().toISOString(),
    });
  };

  const value = {
    currentRide,
    setCurrentRide,
    pickupLocation,
    setPickupLocation,
    destination,
    setDestination,
    rideStatus,
    setRideStatus,
    selectedVehicleType,
    setSelectedVehicleType,
    estimatedPrice,
    setEstimatedPrice,
    estimatedTime,
    setEstimatedTime,
    driverLocation,
    allDrivers,
    loadingDrivers,
    driversError,
    requestRide,
    cancelRide,
    startRide,
    completeRide,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};
