import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";

const ListBankDetails = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    empRef: "",
    pancard: "",
    accno: "",
    bank_name: "",
    ifsc: "",
    branch: "",
    holder_name: "", // Add holder_name to searchQueries
  });
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/crud/get-bank`, {
          credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.success) {
          setBankDetails(responseData.data);
        } else {
          console.error("Error fetching bank details:", responseData);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchInputChange = (e, columnName) => {
    setSearchQueries({
      ...searchQueries,
      [columnName]: e.target.value,
    });
  };

  const filterBankDetails = (bankDetail) => {
    return Object.keys(searchQueries).every((key) =>
      bankDetail[key].toLowerCase().includes(searchQueries[key].toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-1 py-1">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Employee ID"
                value={searchQueries.empRef}
                onChange={(e) => handleSearchInputChange(e, "empRef")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Pancard"
                value={searchQueries.pancard}
                onChange={(e) => handleSearchInputChange(e, "pancard")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Account No."
                value={searchQueries.accno}
                onChange={(e) => handleSearchInputChange(e, "accno")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Bank Name"
                value={searchQueries.bank_name}
                onChange={(e) => handleSearchInputChange(e, "bank_name")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="IFSC"
                value={searchQueries.ifsc}
                onChange={(e) => handleSearchInputChange(e, "ifsc")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Branch"
                value={searchQueries.branch}
                onChange={(e) => handleSearchInputChange(e, "branch")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="Holder Name" // Add input field for holder_name
                value={searchQueries.holder_name}
                onChange={(e) => handleSearchInputChange(e, "holder_name")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bankDetails) &&
            bankDetails.filter(filterBankDetails).map((bankDetail) => (
              <tr key={bankDetail._id} className="bg-white">
                <td className="px-4 py-2 text-center">{bankDetail.empRef}</td>
                <td className="px-4 py-2 text-center">{bankDetail.pancard}</td>
                <td className="px-4 py-2 text-center">{bankDetail.accno}</td>
                <td className="px-4 py-2 text-center">
                  {bankDetail.bank_name}
                </td>
                <td className="px-4 py-2 text-center">{bankDetail.ifsc}</td>
                <td className="px-4 py-2 text-center">{bankDetail.branch}</td>
                <td className="px-4 py-2 text-center">
                  {bankDetail.holder_name}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link
                    to={`/home/update-bank-details/${bankDetail.empRef}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListBankDetails;
