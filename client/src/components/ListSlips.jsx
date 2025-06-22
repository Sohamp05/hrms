import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ListSlips() {
  const [slips, setSlips] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/slip/get-slip`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSlips(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-screen-md">
      <table className="w-full">
        <thead className="bg-slate-300">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Salary</th>
            <th className="px-4 py-2">Date of Issue</th>
          </tr>
        </thead>
        <tbody>
          {slips.map((slip) => (
            <tr key={slip._id}>
              <td className="border px-4 py-2">{slip.empRef}</td>
              <td className="border px-4 py-2">{slip.month}</td>
              <td className="border px-4 py-2">{slip.totsal}</td>
              <td className="border px-4 py-2 ">
                <Link
                  className="px-2 py-1 bg-slate-400 text-white rounded-md hover:bg-slate-500 hover:scale-1"
                  to={`/get-slip/${slip.empRef}/${slip.month}`}
                >
                  {slip.doi}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
