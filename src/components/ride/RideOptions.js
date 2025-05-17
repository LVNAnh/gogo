// src/components/ride/RideOptions.js
import React from "react";
import { useRide } from "../../contexts/RideContext";
import axios from "axios";

const GOONG_API_KEY = "khzB3WJHpDdPBWgSgIF7IkRAuYoUWVLqGRAfhxIK";

const RideOptions = () => {
  const {
    pickupLocation,
    destination,
    selectedVehicleType,
    setSelectedVehicleType,
    setEstimatedPrice,
    setEstimatedTime,
  } = useRide();

  const vehicleTypes = [
    { id: "car", name: "Xe 4 chỗ", pricePerKm: 10000, image: "/car-icon.svg" },
    { id: "suv", name: "Xe 7 chỗ", pricePerKm: 12000, image: "/suv-icon.svg" },
    {
      id: "premium",
      name: "Xe VIP",
      pricePerKm: 15000,
      image: "/premium-icon.svg",
    },
  ];

  const calculateEstimates = async (vehicleType) => {
    if (!pickupLocation || !destination) return;

    try {
      const response = await axios.get("https://api.goong.io/Direction", {
        params: {
          origin: `${pickupLocation[1]},${pickupLocation[0]}`,
          destination: `${destination[1]},${destination[0]}`,
          vehicle: "car",
          api_key: GOONG_API_KEY,
        },
      });

      const route = response.data.routes[0];
      const distance = route.legs[0].distance.value / 1000; // Convert to km
      const duration = route.legs[0].duration.value / 60; // Convert to minutes

      const selectedVehicle = vehicleTypes.find((v) => v.id === vehicleType);
      const basePrice = selectedVehicle.pricePerKm * distance;

      // Add booking fee
      const bookingFee = 10000;
      const totalPrice = Math.round((basePrice + bookingFee) / 1000) * 1000; // Round to nearest 1000 VND

      setEstimatedPrice(totalPrice);
      setEstimatedTime(Math.round(duration));
      setSelectedVehicleType(vehicleType);
    } catch (error) {
      console.error("Error calculating ride:", error);
    }
  };

  React.useEffect(() => {
    if (pickupLocation && destination && selectedVehicleType) {
      calculateEstimates(selectedVehicleType);
    }
  }, [pickupLocation, destination, selectedVehicleType]);

  return (
    <div className="ride-options-container">
      <h3>Chọn loại xe</h3>
      <div className="vehicle-types">
        {vehicleTypes.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`vehicle-type-card ${
              selectedVehicleType === vehicle.id ? "selected" : ""
            }`}
            onClick={() => calculateEstimates(vehicle.id)}
          >
            <img src={vehicle.image} alt={vehicle.name} />
            <div className="vehicle-info">
              <h4>{vehicle.name}</h4>
              <p>{vehicle.pricePerKm.toLocaleString("vi-VN")} VNĐ/km</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptions;
