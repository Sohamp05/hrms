import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateBank() {
  const { empid } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    pancard: "",
    accno: "",
    bank_name: "", // Add other fields here
    ifsc: "",
    branch: "",
    holder_name: "",
  });
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/crud/get-bank/${empid}`
        );
        const data = await response.json();
        console.log("Fetched data:", data); // Check the fetched data
        setBankDetails(data); // Set bankDetails with fetched data
        console.log(bankDetails);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [empid]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBankDetails((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/crud/update-bank/${empid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetails),
      });
      const responseData = await res.json();
      setLoading(false);
      if (responseData.success) {
        navigate(`/home/list-bank-details`); // Navigate to "/home" upon successful update
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <main>
      <div>
        {/* Display the message when data is not null */}
        {bankDetails ? (
          <form className="flex flex-col sm:flex-row gap-1">
            <div className="flex flex-col gap-2 flex-1">
              <h1 className="font-bold text-lg text-slate-700">{empid}</h1>
              <div className="mb-4">
                <label
                  htmlFor="pancard"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pancard
                </label>
                <input
                  type="text"
                  id="pancard"
                  className="border p-1 rounded-sm"
                  onChange={handleChange}
                  value={bankDetails.pancard}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="accno"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account No.
                </label>
                <input
                  type="text"
                  id="accno"
                  className="border p-1 rounded-sm"
                  onChange={handleChange}
                  value={bankDetails.accno}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bank_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bank_name"
                  className="border p-1 rounded-sm"
                  onChange={handleChange}
                  value={bankDetails.bank_name}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="ifsc"
                  className="block text-sm font-medium text-gray-700"
                >
                  IFSC:{" "}
                </label>
                <input
                  type="text"
                  id="ifsc"
                  className="border p-1 rounded-sm"
                  onChange={handleChange}
                  value={bankDetails.ifsc}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="holder_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Holder's name
                </label>
                <input
                  type="text"
                  id="holder_name"
                  className="border p-1 rounded-sm"
                  onChange={handleChange}
                  value={bankDetails.holder_name}
                />
              </div>
            </div>
          </form>
        ) : (
          <p>Loading...</p>
        )}
        <div className="flex justify-center">
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48"
          >
            {loading ? "Loading..." : "Update Bank Details"}
          </button>
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>
    </main>
  );
}
