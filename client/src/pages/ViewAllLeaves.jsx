import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ViewAllLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    fromDate: "",
    toDate: "",
    days: "",
    empRef: "",
    against_balance: "",
    status: "",
  });
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leave/get-leaves`, {
          credentials: "include",
        });
        const data = await response.json();
        // Sort leaves in descending order based on _id
        const sortedLeaves = data.sort((a, b) => b._id.localeCompare(a._id));
        setLeaves(sortedLeaves);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, []);

  const handleSearchInputChange = (e, columnName) => {
    setSearchQueries({
      ...searchQueries,
      [columnName]: e.target.value,
    });
  };

  const filterLeaves = (leave) => {
    return Object.keys(searchQueries).every((key) => {
      const propertyValue = String(leave[key]).toLowerCase().trim(); // Convert to string
      const queryValue = searchQueries[key].toLowerCase().trim();
      return propertyValue.includes(queryValue);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/leave/delete-leave/${id}`,
        {
          method: "DELETE",
          credentials: "include", // Ensure credentials are included for authentication
        }
      );
      if (response.ok) {
        setLeaves((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        alert("Failed to delete leave");
      }
    } catch (error) {
      alert("Error deleting leave");
    }
  };

  return (
    <div className="p-4">
      <table className="min-w-full divide-y divide-neutral-border">
        <thead>
          <tr className="bg-neutral-bg-medium">
            <th className="px-6 py-2 text-center w-40">
              <input
                type="text"
                placeholder="From Date"
                value={searchQueries.fromDate}
                onChange={(e) => handleSearchInputChange(e, "fromDate")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-40">
              <input
                type="text"
                placeholder="To Date"
                value={searchQueries.toDate}
                onChange={(e) => handleSearchInputChange(e, "toDate")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-24">
              <input
                type="text"
                placeholder="Days"
                value={searchQueries.days}
                onChange={(e) => handleSearchInputChange(e, "days")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-40">
              <input
                type="text"
                placeholder="Against"
                value={searchQueries.against_balance}
                onChange={(e) => handleSearchInputChange(e, "against_balance")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-40">
              <input
                type="text"
                placeholder="Employee ID"
                value={searchQueries.empRef}
                onChange={(e) => handleSearchInputChange(e, "empRef")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-32">
              <input
                type="text"
                placeholder="Status"
                value={searchQueries.status}
                onChange={(e) => handleSearchInputChange(e, "status")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-6 py-2 text-center w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.filter(filterLeaves).map((leave) => (
            <tr
              key={leave._id}
              className="bg-custom-white hover:bg-neutral-bg-light"
            >
              <td className="px-6 py-2 text-center w-40">{leave.fromDate}</td>
              <td className="px-6 py-2 text-center w-40">{leave.toDate}</td>
              <td className="px-6 py-2 text-center w-24">{leave.days}</td>
              <td className="px-6 py-2 text-center w-40">
                {leave.against_balance}
              </td>
              <td className="px-6 py-2 text-center w-40">{leave.empRef}</td>
              <td className="px-6 py-2 text-center w-32">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      leave.status === "approved"
                        ? "bg-success text-custom-white"
                        : ""
                    }
                    ${
                      leave.status === "rejected"
                        ? "bg-error text-custom-white"
                        : ""
                    }
                    ${
                      leave.status === "pending"
                        ? "bg-warning text-custom-white"
                        : ""
                    }
                    ${
                      !["approved", "rejected", "pending"].includes(
                        leave.status.toLowerCase()
                      )
                        ? "bg-neutral-bg-medium text-neutral-text"
                        : ""
                    }
                  `}
                >
                  {leave.status}
                </span>
              </td>
              <td className="px-6 py-2 text-center w-40">
                <Link
                  to={`/home/edit-leave/${leave._id}`}
                  className="px-2 py-1 bg-secondary text-custom-white rounded-md hover:bg-secondary-dark text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(leave._id)}
                  className="ml-2 px-2 py-1 bg-error text-custom-white rounded-md hover:bg-red-700 text-sm"
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
}
