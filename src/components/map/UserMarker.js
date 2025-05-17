// src/components/map/UserMarker.js
import React, { useEffect, useState } from "react";

const UserMarker = ({ map, position, isPickup = true }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!map || !position) return;

    // Check if global goongjs is available
    const goongjs = window.goongjs;
    if (!goongjs) return;

    if (marker) {
      marker.setLngLat(position);
    } else {
      // Create a DOM element for the marker
      const el = document.createElement("div");
      el.className = "user-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = isPickup ? "#2ecc71" : "#3498db";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      // Create the marker
      const newMarker = new goongjs.Marker(el).setLngLat(position).addTo(map);

      // Add popup with location type
      const popup = new goongjs.Popup({ offset: 25 }).setHTML(
        `<div><strong>${isPickup ? "Điểm đón" : "Điểm đến"}</strong></div>`
      );

      newMarker.setPopup(popup);
      setMarker(newMarker);
    }

    return () => {
      if (marker) marker.remove();
    };
  }, [map, position, isPickup]);

  return null;
};

export default UserMarker;
