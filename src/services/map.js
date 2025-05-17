// src/services/map.js
import axios from "axios";

const GOONG_API_KEY = "khzB3WJHpDdPBWgSgIF7IkRAuYoUWVLqGRAfhxIK";
const GOONG_API_URL = "https://api.goong.io";

// Service cho các tương tác với Goong Map API
const MapService = {
  // Lấy thông tin tuyến đường giữa hai điểm
  getRoute: async (origin, destination) => {
    try {
      const response = await axios.get(`${GOONG_API_URL}/Direction`, {
        params: {
          origin: `${origin[1]},${origin[0]}`, // lat,lng
          destination: `${destination[1]},${destination[0]}`, // lat,lng
          vehicle: "car",
          api_key: GOONG_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting route:", error);
      throw error;
    }
  },

  // Tìm kiếm địa điểm theo từ khóa
  searchPlaces: async (keyword) => {
    try {
      const response = await axios.get(`${GOONG_API_URL}/Place/AutoComplete`, {
        params: {
          api_key: GOONG_API_KEY,
          input: keyword,
        },
      });

      return response.data.predictions;
    } catch (error) {
      console.error("Error searching places:", error);
      throw error;
    }
  },

  // Lấy chi tiết của một địa điểm theo place_id
  getPlaceDetails: async (placeId) => {
    try {
      const response = await axios.get(`${GOONG_API_URL}/Place/Detail`, {
        params: {
          api_key: GOONG_API_KEY,
          place_id: placeId,
        },
      });

      return response.data.result;
    } catch (error) {
      console.error("Error getting place details:", error);
      throw error;
    }
  },

  // Phân tích địa chỉ thành tọa độ (geocoding)
  geocode: async (address) => {
    try {
      const response = await axios.get(`${GOONG_API_URL}/Geocode`, {
        params: {
          api_key: GOONG_API_KEY,
          address,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0];
      }

      throw new Error("No results found");
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  },

  // Phân tích tọa độ thành địa chỉ (reverse geocoding)
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await axios.get(`${GOONG_API_URL}/Geocode`, {
        params: {
          api_key: GOONG_API_KEY,
          latlng: `${lat},${lng}`,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0];
      }

      throw new Error("No results found");
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      throw error;
    }
  },
};

export default MapService;
