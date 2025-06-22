import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../scrollbar.css"; // Assuming this is for custom scrollbar styling

export default function LeaveCalendar() {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDateLeaves, setSelectedDateLeaves] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leave/get-leaves`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          console.error(data.message);
          return;
        }
        // Filter for approved leaves
        const approved = data.filter((leave) => leave.status === "approved");
        setApprovedLeaves(approved);
      } catch (err) {
        setError("Failed to fetch leave data. Please try again later.");
        console.error(err);
      }
    };

    fetchLeaves();
  }, []);

  const isDateInLeaveRange = (date, leave) => {
    const from = new Date(leave.fromDate);
    from.setHours(0, 0, 0, 0); // Normalize
    const to = new Date(leave.toDate);
    to.setHours(0, 0, 0, 0); // Normalize
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0); // Normalize
    return checkDate >= from && checkDate <= to;
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const leavesOnDate = approvedLeaves.filter((leave) =>
        isDateInLeaveRange(date, leave)
      );
      if (leavesOnDate.length > 0) {
        return (
          <div className="flex justify-center items-center h-full">
            <div
              className="w-2 h-2 bg-error rounded-full"
              title={leavesOnDate.map((l) => l.employeeId).join(", ")}
            ></div>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    const leavesOnClickedDate = approvedLeaves.filter((leave) =>
      isDateInLeaveRange(date, leave)
    );
    setSelectedDateLeaves(leavesOnClickedDate);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-neutral-text">
        Leave Calendar
      </h1>

      {error && (
        <div
          className="bg-error border border-error text-custom-white px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-custom-white p-4 sm:p-6 rounded-lg shadow-lg">
        <Calendar
          onClickDay={handleDateClick}
          tileContent={tileContent}
          className="w-full border-0" // Tailwind class for full width and removing default border
        />
      </div>

      {selectedDateLeaves.length > 0 && (
        <div className="mt-6 bg-neutral-bg-medium p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-neutral-text">
            Leaves on{" "}
            {selectedDateLeaves[0]
              ? new Date(selectedDateLeaves[0].fromDate).toLocaleDateString(
                  undefined,
                  { month: "long", day: "numeric" }
                )
              : ""}
          </h2>
          <ul className="space-y-2">
            {selectedDateLeaves.map((leave) => (
              <li
                key={leave._id}
                className="p-3 bg-custom-white rounded-md shadow-sm border border-neutral-border"
              >
                <p className="font-medium text-neutral-text">
                  Employee ID:{" "}
                  <span className="font-normal text-neutral-text-light">
                    {leave.employeeId}
                  </span>
                </p>
                <p className="font-medium text-neutral-text">
                  Duration:{" "}
                  <span className="font-normal text-neutral-text-light">
                    {new Date(leave.fromDate).toLocaleDateString()} -{" "}
                    {new Date(leave.toDate).toLocaleDateString()}
                  </span>
                </p>
                {leave.reason && (
                  <p className="font-medium text-neutral-text">
                    Reason:{" "}
                    <span className="font-normal text-neutral-text-light">
                      {leave.reason}
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
