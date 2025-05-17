// src/hooks/useDriverLocation.js
import { useState, useEffect } from "react";
import io from "socket.io-client";

const useDriverLocation = (rideId) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverRotation, setDriverRotation] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rideId) return;

    // Trong một ứng dụng thực, bạn sẽ kết nối với một socket.io server
    // và lắng nghe các cập nhật vị trí của tài xế từ server

    // Mô phỏng nhận vị trí tài xế mỗi 3 giây
    const interval = setInterval(() => {
      // Mô phỏng vị trí tài xế di chuyển quanh vị trí trung tâm
      const center = [105.83991, 21.028]; // Hanoi center
      const randomOffset = () => (Math.random() - 0.5) * 0.01;

      const newLocation = [
        center[0] + randomOffset(),
        center[1] + randomOffset(),
      ];

      // Tính toán hướng di chuyển (rotation)
      if (driverLocation) {
        const dx = newLocation[0] - driverLocation[0];
        const dy = newLocation[1] - driverLocation[1];
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        setDriverRotation(angle);
      }

      setDriverLocation(newLocation);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [rideId, driverLocation]);

  // Trong ứng dụng thực, bạn sẽ kết nối với backend thông qua socket.io
  /*
  useEffect(() => {
    if (!rideId) return;
    
    const socket = io('YOUR_BACKEND_URL');
    
    socket.emit('joinRide', { rideId });
    
    socket.on('driverLocationUpdate', (data) => {
      setDriverLocation([data.longitude, data.latitude]);
      setDriverRotation(data.rotation || 0);
    });
    
    socket.on('error', (error) => {
      setError(error);
    });
    
    return () => {
      socket.emit('leaveRide', { rideId });
      socket.disconnect();
    };
  }, [rideId]);
  */

  return { driverLocation, driverRotation, error };
};

export default useDriverLocation;
