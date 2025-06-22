import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../scrollbar.css";

export default function HomeContent() {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leavesToday, setLeavesToday] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    // Fetch all leaves
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leave/get-leaves`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          console.error(data.message);
          return;
        }
        // Filter for pending leaves
        setPendingLeaves(data.filter((leave) => leave.status === "pending"));

        // Filter for members on leave today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        setLeavesToday(
          data.filter((leave) => {
            const fromDate = new Date(leave.fromDate);
            const toDate = new Date(leave.toDate);
            return (
              leave.status === "approved" &&
              fromDate <= today &&
              today <= toDate
            );
          })
        );
      } catch (err) {
        setError("Failed to fetch leave data.");
        console.error(err);
      }
    };

    // Fetch all employees
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/crud/get`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          console.error(data.message);
          return;
        }
        setEmployees(data);
      } catch (err) {
        setError("Failed to fetch employee data.");
        console.error(err);
      }
    };

    fetchLeaves();
    fetchEmployees();
  }, []);

  return (
    <div className="p-4 space-y-6 h-screen overflow-y-auto">
      {/* Error Display */}
      {error && (
        <div
          className="bg-error border border-error text-custom-white px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Link
          to="/home/view-all-leaves"
          className="bg-primary hover:bg-primary-dark text-custom-white font-bold py-2 px-4 rounded text-center"
        >
          Manage Leave Approvals
        </Link>
        <Link
          to="/home/leave-calendar"
          className="bg-secondary hover:bg-secondary-dark text-custom-white font-bold py-2 px-4 rounded text-center"
        >
          View Leave Calendar
        </Link>
      </div>

      {/* Unapproved Leave Requisitions Section */}
      <div className="bg-custom-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 text-neutral-text">
          Unapproved Leave Requisitions
        </h2>
        {pendingLeaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-custom-white">
              <thead className="bg-neutral-bg-medium">
                <tr>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Employee ID
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    From Date
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    To Date
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Reason
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-neutral-bg-light">
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {leave.employeeId}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {leave.reason || "-"}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === "pending"
                            ? "bg-warning text-custom-white"
                            : ""
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-text-light">
            No pending leave requisitions.
          </p>
        )}
      </div>

      {/* Members on Leave Today Section */}
      <div className="bg-custom-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 text-neutral-text">
          Members on Leave Today
        </h2>
        {leavesToday.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-custom-white">
              <thead className="bg-neutral-bg-medium">
                <tr>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Employee ID
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    From Date
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    To Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {leavesToday.map((leave) => (
                  <tr key={leave._id} className="hover:bg-neutral-bg-light">
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {leave.employeeId}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-text-light">
            No employees are on leave today.
          </p>
        )}
      </div>

      {/* Employee Information Section */}
      <div className="bg-custom-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 text-neutral-text">
          Employee Information
        </h2>
        <p className="mb-3 text-neutral-text-light">
          Total Employees: {employees.length}
        </p>
        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-custom-white">
              <thead className="bg-neutral-bg-medium">
                <tr>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Employee ID
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Post
                  </th>
                  <th className="py-2 px-4 border-b border-neutral-border text-left text-sm font-medium text-neutral-text-light">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-neutral-bg-light">
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {employee.employeeId}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {employee.fname} {employee.lname}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {employee.post}
                    </td>
                    <td className="py-2 px-4 border-b border-neutral-border text-sm text-neutral-text">
                      {employee.department}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-text-light">No employees found.</p>
        )}
      </div>
    </div>
  );
}
