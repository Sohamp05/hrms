import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function UpdateLeave() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    empRef: "",
    fromDate: "",
    toDate: "",
    days: "",
    reason: "",
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/leave/get-leave/${id}`,
          {
            credentials: "include", // Ensure credentials are included for authentication
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error("Failed to fetch leave data");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/leave/update-leave/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update leave");
      }
      console.log("Leave updated successfully");
      navigate("/home/view-all-leaves");
    } catch (error) {
      console.error("Error updating leave:", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">Employee Reference:</label>
          <input
            type="text"
            name="empRef"
            value={formData.empRef}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">Number of Days:</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">Reason:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="pending">pending</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
