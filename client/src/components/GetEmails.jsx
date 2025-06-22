import React, { useState, useEffect } from "react";

export default function GetEmails() {
  const [emails, setEmails] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/crud/get-email`);
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="max-w-screen-md">
      <table className="w-full">
        <thead className="bg-slate-300">
          <tr>
            <th className="px-4 py-2">Employee ID</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((employee) => (
            <tr key={employee.empid} className="border">
              <td
                className="px-4 py-2 cursor-pointer text-center hover:bg-gray-200"
                onClick={() => handleEmailClick(employee.email)}
              >
                {employee.empid}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
