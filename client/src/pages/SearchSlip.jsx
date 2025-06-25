import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchSlip = () => {
  const [slips, setSlips] = useState([]);
  const [searchEmpId, setSearchEmpId] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/slip/get-slip`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        const sortedSlips = data.sort(
          (a, b) => new Date(b.doi) - new Date(a.doi)
        );
        setSlips(sortedSlips);
      })
      .catch((error) => console.error("Error fetching slips:", error));
  }, []);

  // Handle delete slip
  const handleDelete = (empRef, month) => {
    if (
      window.confirm(
        `Are you sure you want to delete the slip for Employee ${empRef} for the month of ${month}?`
      )
    ) {
      fetch(`${API_BASE_URL}/api/slip/delete-slip/${empRef}/${month}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            // Update the list after deletion
            setSlips((prevSlips) =>
              prevSlips.filter(
                (slip) => !(slip.empRef === empRef && slip.month === month)
              )
            );
          } else {
            console.error("Error deleting slip");
          }
        })
        .catch((error) => console.error("Error deleting slip:", error));
    }
  };

  // Filter slips based on search input
  const filteredSlips = slips.filter((slip) => {
    return (
      slip.empRef.toLowerCase().includes(searchEmpId.toLowerCase()) &&
      slip.month.toLowerCase().includes(searchMonth.toLowerCase())
    );
  });

  return (
    <div>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search Employee ID"
          value={searchEmpId}
          onChange={(e) => setSearchEmpId(e.target.value)}
          className="px-2 py-1 border rounded-md"
        />
        <input
          type="text"
          placeholder="Search Month"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          className="px-2 py-1 border rounded-md"
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-200">
            <th className="px-2 py-1 text-center">Employee ID</th>
            <th className="px-2 py-1 text-center">Month</th>
            <th className="px-2 py-1 text-center">Total Salary</th>
            <th className="px-2 py-1 text-center">Date of Issue</th>
            <th className="px-2 py-1 text-center">Action</th>
            <th className="px-2 py-1 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {filteredSlips.map((slip) => (
            <tr key={slip._id} className="border-b border-gray-300">
              <td className="px-2 py-1 text-center">{slip.empRef}</td>
              <td className="px-2 py-1 text-center">{slip.month}</td>
              <td className="px-2 py-1 text-center">{slip.totsal}</td>
              <td className="px-2 py-1 text-center">{slip.doi}</td>
              <td className="px-2 py-1 text-center">
                <Link
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  to={`/get-slip/${slip.empRef}/${slip.month}`}
                >
                  View
                </Link>
              </td>
              <td className="px-2 py-1 text-center">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(slip.empRef, slip.month)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchSlip;
