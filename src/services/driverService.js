// src/services/driverService.js
import axios from "axios";

const API_BASE_URL = "http://192.168.21.193:5000/api";

const driverService = {
  getAllDrivers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers`);
      return response.data.drivers;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  },
};

export default driverService;
