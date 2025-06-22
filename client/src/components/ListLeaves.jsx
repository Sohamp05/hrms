import React, { useState, useEffect } from "react";

export default function ListLeaves() {
  const [leaves, setLeaves] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leave/get-leaves`);
        const data = await response.json();
        setLeaves(data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeaves();
  }, []);

  // Reverse the leaves array
  const reversedLeaves = [...leaves].reverse();

  return (
    <div className="max-w-screen-md">
      <table className="w-full">
        <thead className="bg-slate-300">
          <tr>
            <th className=" px-4 py-2">From</th>
            <th className=" px-4 py-2">To</th>
            <th className=" px-4 py-2">ID</th>
            <th className=" px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reversedLeaves.map((leave) => (
            <tr key={leave._id} className="border">
              <td className=" px-4 py-2">{leave.fromDate}</td>
              <td className=" px-4 py-2">{leave.toDate}</td>
              <td className=" px-4 py-2">{leave.empRef}</td>
              <td className=" px-4 py-2">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
