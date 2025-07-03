import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

export default function EmployeeNotifications() {
  const { socket, connectAsEmployee, isConnected } = useSocket();
  const { currentUserEmp } = useSelector((state) => state.employee);

  useEffect(() => {
    if (socket && currentUserEmp && isConnected) {
      // Connect as employee
      connectAsEmployee(currentUserEmp.empid);

      // Listen for leave status updates
      const handleLeaveStatusUpdate = (data) => {
        // Only show notification if it's for this employee
        if (data.empRef === currentUserEmp.empid) {
          console.log("📧 Received leave status update:", data);

          // Show browser notification
          if (Notification.permission === "granted") {
            new Notification("Leave Request Update", {
              body: data.message,
              icon: "/favicon.ico",
              tag: "leave-status",
            });
          }

          // Show toast notification (you can integrate with a toast library)
          const toast = document.createElement("div");
          toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            data.status === "approved" ? "bg-green-500" : "bg-red-500"
          } text-white`;
          toast.innerHTML = `
            <div class="flex items-center space-x-2">
              <span>${data.status === "approved" ? "✅" : "❌"}</span>
              <div>
                <p class="font-medium">${data.message}</p>
                <p class="text-sm opacity-90">${data.days} day(s) - ${new Date(
            data.fromDate
          ).toLocaleDateString()}</p>
              </div>
            </div>
          `;

          document.body.appendChild(toast);

          // Auto-remove toast after 5 seconds
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 5000);
        }
      };

      socket.on("leave-status-update", handleLeaveStatusUpdate);

      // Cleanup listeners
      return () => {
        socket.off("leave-status-update", handleLeaveStatusUpdate);
      };
    }
  }, [socket, currentUserEmp, isConnected, connectAsEmployee]);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  // This component doesn't render anything visible, it just handles notifications
  return null;
}
