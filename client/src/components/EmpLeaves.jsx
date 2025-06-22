import React, { useState, useEffect } from "react";

export default function EmpLeaves({ empid }) {
  const [leaves, setLeaves] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employee-auth/emp-leaves/${empid}`)
      .then((response) => response.json())
      .then((data) => {
        const sortedLeaves = data.sort(
          (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
        );
        setLeaves(sortedLeaves);
      })
      .catch((error) => {
        console.error("Error fetching employee leaves:", error);
      });
  }, [empid]);

  return (
    <div className="max-w-screen-md h-64 overflow-y-auto">
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead className="bg-slate-300">
          <tr>
            <th className="py-2 px-4 text-sm text-center">From Date</th>
            <th className="py-2 px-4 text-sm text-center">To Date</th>
            <th className="py-2 px-4 text-sm text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="py-2 px-4 text-sm text-center">
                {leave.fromDate}
              </td>
              <td className="py-2 px-4 text-sm text-center">{leave.toDate}</td>
              <td className="py-2 px-4 text-sm text-center">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
