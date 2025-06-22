import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empSearch, setEmpSearch] = useState({
    empid: "",
  });
  const navigate = useNavigate();
  // Define the state variable for data
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    empid: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    phone: "",
    aadhar: "",
    dob: "",
    address: "",
    hometype: "",
    bloodgroup: "",
    gender: "",
    mstatus: "",
    passport: "",
    degree: "",
    post: "",
    department: "",
    bsalary: "",
    status: "",
    doj: "",
    bonus_date: "",
    leave_balance: "",
    password: "",
    hra: 0,
    lta: 0,
    ta: 0,
    ma: 0,
    mpa: 0,
    sa: 0,
    pfempes: 0,
  });
  const [bankData, setBankData] = useState({
    pancard: "",
    accno: "",
    bank_name: "",
    ifsc: "",
    branch: "",
    empRef: "",
    holder_name: "",
  });

  const handleSearchChange = (e) => {
    if (e.target.id === "empid") {
      setEmpSearch({
        ...empSearch,
        empid: e.target.value,
      });
    }
  };
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/crud/get/${empSearch.empid}`
      );
      const fetchedData = await res.json();
      setData(fetchedData);
      setFormData(fetchedData);

      const bankRes = await fetch(
        `${API_BASE_URL}/api/crud/get-bank/${empSearch.empid}`
      );
      const bankFetch = await bankRes.json();
      setBankData(bankFetch);
      console.log(bankFetch); // Log the fetched bank data
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    console.log(bankData);
  }, [bankData]);

  const printpage = async (e) => {
    window.print();
  };

  return (
    <main>
      <div>
        <form onSubmit={handleSubmit}>
          Enter Employee ID: <br />
          <input
            type="text"
            id="empid"
            name="empid"
            className="border p-1 rounded-sm"
            onChange={handleSearchChange}
            value={empSearch.empid}
          />
          <button className="p-1.5 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ml-2">
            Search
          </button>
        </form>
      </div>
      {/* Display the message when data is not null */}
      {data && (
        <main className="p-1 max-w-4xl mx-auto">
          {/* <h1 className="text-3xl font-semibold text-center my-2">Add Employee</h1> */}
          <form className="flex flex-col sm:flex-row gap-1">
            <div className="flex flex-col gap-2 flex-1">
              Employee ID:
              <input
                type="text"
                id="empid"
                className="border p-1 rounded-sm"
                value={formData.empid}
              />
              First Name:
              <input
                type="text"
                id="fname"
                className="border p-1 rounded-sm"
                value={formData.fname}
              />
              Middle Name:
              <input
                type="text"
                id="mname"
                className="border p-1 rounded-sm"
                value={formData.mname}
              />
              Last Name:
              <input
                type="text"
                id="lname"
                className="border p-1 rounded-sm"
                value={formData.lname}
              />
              Email ID:
              <input
                type="text"
                id="email"
                className="border p-1 rounded-sm"
                value={formData.email}
              />
              Phone No.:
              <input
                type="number"
                id="phone"
                className="border p-1 rounded-sm"
                value={formData.phone}
              />
              Aadhar No.:
              <input
                type="number"
                id="aadhar"
                className="border p-1 rounded-sm"
                value={formData.aadhar}
              />
              Date of Birth:
              <input
                type="date"
                id="dob"
                className="border p-1 rounded-sm"
                value={formData.dob}
              />
              Address:
              <textarea
                type=""
                id="address"
                className="border p-1 rounded-sm"
                value={formData.address}
              />
              Home Type:
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="permanent"
                  className="w-5"
                  checked={formData.hometype === "permanent"}
                />
                <span>Permanent</span>
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  checked={formData.home === "rent"}
                />
                <span>Rental</span>
              </div>
              Blood Group:
              <input
                type="text"
                id="bloodgroup"
                className="border p-1 rounded-sm"
                value={formData.bloodgroup}
              />
              Gender:
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="male"
                  className="w-5"
                  checked={formData.gender === "male"}
                />
                <span>Male</span>
                <input
                  type="checkbox"
                  id="female"
                  className="w-5"
                  checked={formData.gender === "female"}
                />
                <span>Female</span>
              </div>
              Marital Status:
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="single"
                  className="w-5"
                  checked={formData.mstatus === "single"}
                />
                <span>Single</span>
                <input
                  type="checkbox"
                  id="married"
                  className="w-5"
                  checked={formData.mstatus === "married"}
                />
                <span>Married</span>
              </div>
              Passport No.:
              <input
                type="text"
                id="passport"
                className="border p-1 rounded-sm"
                value={formData.passport}
              />
            </div>
            <div className="flex flex-col flex-1 gap-2">
              Degree:
              <input
                type="text"
                id="degree"
                className="border p-1 rounded-sm"
                value={formData.degree}
              />
              Post:
              <input
                type="text"
                id="post"
                className="border p-1 rounded-sm"
                value={formData.post}
              />
              Department:
              <input
                type="text"
                id="department"
                className="border p-1 rounded-sm"
                value={formData.department}
              />
              Basic Salary:
              <input
                type="number"
                id="bsalary"
                className="border p-1 rounded-sm"
                value={formData.bsalary}
              />
              Status:
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="active"
                  className="w-5"
                  checked={formData.status === "active"}
                />
                <span>Active</span>
                <input
                  type="checkbox"
                  id="inactive"
                  className="w-5"
                  checked={formData.status === "inactive"}
                />
                <span>Inactive</span>
                <input
                  type="checkbox"
                  id="resigned"
                  className="w-5"
                  checked={formData.status === "resigned"}
                />
                <span>Resigned</span>
              </div>
              Date of joining:
              <input
                type="date"
                id="doj"
                className="border p-1 rounded-sm"
                value={formData.doj}
              />
              Date of Probation:
              <input
                type="date"
                id="bonus_date"
                className="border p-1 rounded-sm"
                value={formData.bonus_date}
              />
              Leave Balance:
              <input
                type="number"
                id="leave_balance"
                className="border p-1 rounded-sm"
                value={formData.leave_balance}
              />
              Pancard No.:
              <input
                type="text"
                id="pancard"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.pancard : ""}
              />
              Account Number:
              <input
                type="text"
                id="accno"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.accno : ""}
              />
              Bank Name:
              <input
                type="text"
                id="bank_name"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.bank_name : ""}
              />
              Branch Name:
              <input
                type="text"
                id="branch"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.branch : ""}
              />
              IFSC code:
              <input
                type="text"
                id="ifsc"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.ifsc : ""}
              />
              Account Holder Name:
              <input
                type="text"
                id="holder_name"
                className="border p-1 rounded-sm"
                value={bankData.data ? bankData.data.holder_name : ""}
              />
              <hr />
              House Rent Allowance:
              <input
                type="number"
                id="hra"
                className="border p-1 rounded-sm"
                value={formData.hra}
              />
              Travel Allowance:
              <input
                type="number"
                id="ta"
                className="border p-1 rounded-sm"
                value={formData.ta}
              />
              Special Allowance:
              <input
                type="number"
                id="sa"
                className="border p-1 rounded-sm"
                value={formData.sa}
              />
              Medical Allowance:
              <input
                type="number"
                id="ma"
                className="border p-1 rounded-sm"
                value={formData.ma}
              />
              Mediclaim & PA:
              <input
                type="number"
                id="mpa"
                className="border p-1 rounded-sm"
                value={formData.mpa}
              />
              Leave Travel Allowance:
              <input
                type="number"
                id="lta"
                className="border p-1 rounded-sm"
                value={formData.lta}
              />
              PF Employee:
              <input
                type="number"
                id="pfempes"
                className="border p-1 rounded-sm"
                value={formData.pfempes}
              />
            </div>
          </form>
          <div className="flex justify-center ">
            <button
              disabled={loading}
              onClick={printpage}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-48"
            >
              {loading ? "Loading..." : "Print"}
            </button>
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </main>
      )}
    </main>
  );
}
