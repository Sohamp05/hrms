import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_APP_API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔌 WebSocket connection error:", error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up WebSocket connection");
      newSocket.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => {
      // Add timestamp if not present
      const notificationWithTime = {
        ...notification,
        id: Date.now() + Math.random(), // Unique ID
        timestamp: notification.timestamp || new Date().toISOString(),
        read: false,
      };

      // Keep only last 50 notifications
      return [notificationWithTime, ...prev.slice(0, 49)];
    });
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter((notif) => !notif.read).length;
  };

  const connectAsAdmin = (adminId) => {
    if (socket && isConnected) {
      socket.emit("admin-connect", adminId);
      console.log(`👨‍💼 Connected as admin: ${adminId}`);
    }
  };

  const connectAsEmployee = (empId) => {
    if (socket && isConnected) {
      socket.emit("employee-connect", empId);
      console.log(`👤 Connected as employee: ${empId}`);
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadCount,
    connectAsAdmin,
    connectAsEmployee,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
