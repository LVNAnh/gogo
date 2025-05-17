// src/components/map/DriverMarker.js
import React, { useEffect, useState } from "react";
import goongjs from "@goongmaps/goong-js";

const DriverMarker = ({
  map,
  position,
  driverName,
  isAssigned = false,
  rotation = 0,
}) => {
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (!map || !position) return;

    if (marker) {
      marker.setLngLat(position);

      // Update rotation to show direction
      const el = marker.getElement();
      if (el) {
        el.style.transform = `rotate(${rotation}deg)`;
      }
    } else {
      // Create a DOM element for the marker
      const el = document.createElement("div");
      el.className = "driver-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundSize = "100%";
      el.style.backgroundImage = "url(/car-icon.svg)";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = isAssigned ? "#3498db" : "#e74c3c";
      el.style.border = "2px solid white";
      el.style.transform = `rotate(${rotation}deg)`;
      el.style.cursor = "pointer";

      // Create the marker
      const newMarker = new goongjs.Marker(el).setLngLat(position).addTo(map);

      // Add popup with driver name if provided
      if (driverName) {
        const newPopup = new goongjs.Popup({ offset: 25 }).setHTML(
          `<div><strong>${driverName}</strong></div>`
        );

        newMarker.setPopup(newPopup);
        setPopup(newPopup);
      }

      setMarker(newMarker);
    }

    return () => {
      if (marker) marker.remove();
      if (popup) popup.remove();
    };
  }, [map, position, driverName, isAssigned, rotation]);

  return null;
};

export default DriverMarker;
