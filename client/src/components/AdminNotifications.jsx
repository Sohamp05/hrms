import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

export default function AdminNotifications() {
  const {
    socket,
    notifications,
    addNotification,
    getUnreadCount,
    markAllAsRead,
    connectAsAdmin,
    isConnected,
  } = useSocket();
  const { currentUser } = useSelector((state) => state.user);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (socket && currentUser && isConnected) {
      // Connect as admin
      connectAsAdmin(currentUser._id);

      // Listen for leave request notifications
      const handleLeaveRequestNotification = (data) => {
        console.log("📧 Received leave request notification:", data);
        addNotification(data);

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification("New Leave Request", {
            body: data.message,
            icon: "/favicon.ico",
            tag: "leave-request",
          });
        }
      };

      socket.on("leave-request-notification", handleLeaveRequestNotification);

      // Cleanup listeners
      return () => {
        socket.off(
          "leave-request-notification",
          handleLeaveRequestNotification
        );
      };
    }
  }, [socket, currentUser, isConnected, connectAsAdmin, addNotification]);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setTimeout(() => markAllAsRead(), 1000);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="relative">
      {/* Connection Status Indicator */}
      <div
        className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
          isConnected ? "bg-green-400" : "bg-red-400"
        }`}
        title={isConnected ? "Connected" : "Disconnected"}
      ></div>

      {/* Notification Bell Button */}
      <button
        onClick={handleNotificationClick}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
        title="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM15 17H9m6 0V7a3 3 0 00-6 0v10"
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-gray-500">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                  />
                </svg>
                <p>No notifications yet</p>
                <p className="text-xs">You'll see leave requests here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-l-blue-400"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {notification.type === "NEW_LEAVE_REQUEST" && (
                          <span className="text-blue-500">📋</span>
                        )}
                        <span className="font-medium text-sm text-gray-800">
                          {notification.message}
                        </span>
                      </div>

                      {notification.fromDate && (
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            📅{" "}
                            {new Date(
                              notification.fromDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(notification.toDate).toLocaleDateString()}
                          </p>
                          <p>⏱️ {notification.days} day(s)</p>
                          {notification.against_balance > 0 && (
                            <p className="text-orange-600 font-medium">
                              ⚠️ {notification.against_balance} days against
                              balance
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-xs text-gray-400 ml-2">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => (window.location.href = "/home/view-all-leaves")}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Leave Requests →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
