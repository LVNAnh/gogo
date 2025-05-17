// src/hooks/useCurrentLocation.js
import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      const { longitude, latitude } = position.coords;
      setLocation([longitude, latitude]);
      setLoading(false);
    };

    const errorHandler = (error) => {
      setError(error.message);
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // 10 seconds
        timeout: 5000, // 5 seconds
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, loading };
};

export default useCurrentLocation;
