// src/components/map/RoutePolyline.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const RoutePolyline = ({ map, origin, destination }) => {
  const [routeId, setRouteId] = useState(null);
  const GOONG_API_KEY = "khzB3WJHpDdPBWgSgIF7IkRAuYoUWVLqGRAfhxIK";

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const getRoute = async () => {
      try {
        const response = await axios.get(`https://api.goong.io/Direction`, {
          params: {
            origin: `${origin[1]},${origin[0]}`,
            destination: `${destination[1]},${destination[0]}`,
            vehicle: "car",
            api_key: GOONG_API_KEY,
          },
        });

        const route = response.data.routes[0];
        const geometry = route.overview_polyline.points;

        // Remove previous route if exists
        if (routeId && map.getSource("route")) {
          map.removeLayer("route");
          map.removeSource("route");
        }

        // Add route to the map
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: decodePolyline(geometry),
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3498db",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });

        setRouteId("route");

        // Adjust map to fit the route
        const bounds = new window.goongjs.LngLatBounds();
        decodePolyline(geometry).forEach((point) => {
          bounds.extend(point);
        });

        map.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      } catch (error) {
        console.error("Error getting route:", error);
      }
    };

    getRoute();

    return () => {
      if (routeId && map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
    };
  }, [map, origin, destination]);

  // Function to decode polyline
  const decodePolyline = (str, precision = 5) => {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, precision);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
  };

  return null;
};

export default RoutePolyline;
