import React, { useState, useEffect } from "react";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crud/get-department`);
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data);
      } else {
        console.error("Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/crud/delete-department/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setDepartments(
          departments.filter((department) => department._id !== id)
        );
      } else {
        console.error("Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/crud/add-department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department: newDepartment }),
      });
      if (response.ok) {
        fetchDepartments(); // Refetch departments to update the list
        setNewDepartment(""); // Clear the input field after adding
      } else {
        console.error("Failed to add department");
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <div className="max-w-screen-md h-64 overflow-y-auto">
      <div className="mb-1 flex">
        <input
          type="text"
          className="px-3 py-2 border rounded mr-2"
          placeholder="Enter department name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
          onClick={handleAddDepartment}
        >
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-slate-300 text-gray-700">
                Department Name
              </th>
              <th className="px-4 py-2 bg-slate-300 text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {departments.map((department) => (
              <tr key={department._id}>
                <td className="px-4 py-2 text-center">
                  {department.department}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteDepartment(department._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManagement;
