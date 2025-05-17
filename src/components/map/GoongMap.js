// src/components/map/GoongMap.js
import React, { useEffect, useRef, useState } from "react";
import goongjs from "@goongmaps/goong-js";
// Bỏ đoạn import CSS và thêm vào index.html thông qua CDN

const GOONG_MAPTILES_KEY = "khzB3WJHpDdPBWgSgIF7IkRAuYoUWVLqGRAfhxIK";
const GOONG_API_KEY = "0cbAqIA7NZimLsVEiazPK4OdQCWStFG1jFeciE1U";

const GoongMap = ({ userLocation, children }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    goongjs.accessToken = GOONG_MAPTILES_KEY;

    const initializeMap = () => {
      const mapInstance = new goongjs.Map({
        container: mapContainerRef.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: userLocation || [105.83991, 21.028], // Default to Hanoi if no user location
        zoom: 15,
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
      });
    };

    if (!map) initializeMap();

    return () => {
      if (map) map.remove();
    };
  }, []);

  // Update the map center when user location changes
  useEffect(() => {
    if (map && userLocation) {
      map.flyTo({
        center: userLocation,
        zoom: 15,
      });
    }
  }, [map, userLocation]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "70vh" }} />
      {map &&
        React.Children.map(children, (child) =>
          child ? React.cloneElement(child, { map }) : null
        )}
    </div>
  );
};

export default GoongMap;
