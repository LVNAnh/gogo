// src/services/socket.js
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.connected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Khách hàng lắng nghe sự kiện cập nhật vị trí của tài xế
  onDriverLocationUpdate(rideId, callback) {
    if (!this.socket) return;

    this.socket.on(`ride:${rideId}:driverLocation`, callback);

    return () => {
      this.socket.off(`ride:${rideId}:driverLocation`, callback);
    };
  }

  // Khách hàng lắng nghe sự kiện cập nhật trạng thái chuyến đi
  onRideStatusUpdate(rideId, callback) {
    if (!this.socket) return;

    this.socket.on(`ride:${rideId}:statusUpdate`, callback);

    return () => {
      this.socket.off(`ride:${rideId}:statusUpdate`, callback);
    };
  }

  // Tài xế lắng nghe sự kiện yêu cầu chuyến đi mới
  onNewRideRequest(callback) {
    if (!this.socket) return;

    this.socket.on("driver:newRideRequest", callback);

    return () => {
      this.socket.off("driver:newRideRequest", callback);
    };
  }

  // Tài xế cập nhật vị trí của mình cho server
  emitDriverLocation(latitude, longitude) {
    if (!this.socket || !this.connected) return;

    this.socket.emit("driver:updateLocation", { latitude, longitude });
  }

  // Tham gia vào phòng theo ID chuyến đi
  joinRideRoom(rideId) {
    if (!this.socket || !this.connected) return;

    this.socket.emit("ride:join", { rideId });
  }

  // Rời khỏi phòng theo ID chuyến đi
  leaveRideRoom(rideId) {
    if (!this.socket || !this.connected) return;

    this.socket.emit("ride:leave", { rideId });
  }
}

// Xuất instance duy nhất
export default new SocketService();
