// src/components/ride/LocationSearch.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRide } from "../../contexts/RideContext";

const GOONG_API_KEY = "khzB3WJHpDdPBWgSgIF7IkRAuYoUWVLqGRAfhxIK";

const LocationSearch = () => {
  const { pickupLocation, setPickupLocation, destination, setDestination } =
    useRide();
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isPickupFocused, setIsPickupFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const searchPlaces = async (query, setResults) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.goong.io/Place/AutoComplete",
        {
          params: {
            api_key: GOONG_API_KEY,
            input: query,
          },
        }
      );

      setResults(response.data.predictions);
    } catch (error) {
      console.error("Error searching places:", error);
    }
  };

  const getPlaceDetails = async (placeId, setLocation, setText) => {
    try {
      const response = await axios.get("https://api.goong.io/Place/Detail", {
        params: {
          api_key: GOONG_API_KEY,
          place_id: placeId,
        },
      });

      const { geometry, name } = response.data.result;
      const { lng, lat } = geometry.location;

      setText(name);
      setLocation([lng, lat]);
    } catch (error) {
      console.error("Error getting place details:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlaces(pickupText, setPickupSuggestions);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pickupText]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlaces(destinationText, setDestinationSuggestions);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [destinationText]);

  return (
    <div className="location-search-container">
      <div className="location-input-container">
        <div className="input-group">
          <label>Điểm đón</label>
          <input
            type="text"
            value={pickupText}
            onChange={(e) => setPickupText(e.target.value)}
            onFocus={() => setIsPickupFocused(true)}
            onBlur={() => setTimeout(() => setIsPickupFocused(false), 200)}
            placeholder="Nhập điểm đón"
          />
          {isPickupFocused && pickupSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {pickupSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() =>
                    getPlaceDetails(
                      suggestion.place_id,
                      setPickupLocation,
                      setPickupText
                    )
                  }
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Điểm đến</label>
          <input
            type="text"
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
            onFocus={() => setIsDestinationFocused(true)}
            onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
            placeholder="Nhập điểm đến"
          />
          {isDestinationFocused && destinationSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() =>
                    getPlaceDetails(
                      suggestion.place_id,
                      setDestination,
                      setDestinationText
                    )
                  }
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
