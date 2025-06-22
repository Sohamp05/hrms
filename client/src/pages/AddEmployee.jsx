import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
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
    home: "permanent",
    bloodgroup: "",
    gender: "male", // Default value set to 'Male'
    mstatus: "single", // Default value set to 'Single'
    degree: "",
    post: "",
    department: "",
    bsalary: 0, // Default value set to 51000
    status: "active", // Default value set to 'Active'
    doj: "",
    passport: "",
    bonusMonths: 0,
    bonus_date: "",
    leave_balance: 0, // Default value set to 0
    oneyear: "0", // Default value set to '0' as a string
    password: "",
    pancard: "",
    accno: "",
    bank_name: "",
    ifsc: "",
    branch: "",
    holder_name: "",
    hra: 0,
    lta: 0,
    ta: 0,
    ma: 0,
    mpa: 0,
    sa: 0,
    pfempes: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(formData);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crud/get-department`);
      const data = await res.json();
      if (data.success) {
        setDepartments(data.data.map((department) => department.department));
      } else {
        setError("Failed to fetch departments");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    setFormData((prevFormData) => {
      let updatedData = { ...prevFormData, [id]: value };

      if (id === "doj" || id === "bonusMonths") {
        updatedData.bonus_date = calculateBonusDate(
          id === "doj" ? value : prevFormData.doj,
          id === "bonusMonths" ? value : prevFormData.bonusMonths
        );
      }

      return updatedData;
    });
  };

  const calculateBonusDate = (doj, bonusMonths) => {
    if (!doj || !bonusMonths) return ""; // If either doj or bonusMonths is empty, return empty string for bonus date

    const dojDate = new Date(doj);
    const bonusDate = new Date(
      dojDate.setMonth(dojDate.getMonth() + parseInt(bonusMonths))
    );

    // Format the bonus date as "YYYY-MM-DD"
    return bonusDate.toISOString().split("T")[0];
  };
  //  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`${API_BASE_URL}/api/crud/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        alert("employee successfully added");
      }
      navigate(`/home`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    console.log(formData);
  };

  return (
    <main className="p-1 max-w-4xl mx-auto">
      {/* <h1 className="text-3xl font-semibold text-center my-2">Add Employee</h1> */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-1">
        <div className="flex flex-col gap-2 flex-1">
          <b> Employee ID:</b>
          <input
            type="text"
            id="empid"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.empid}
          />
          First Name:
          <input
            type="text"
            id="fname"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.fname}
          />
          Middle Name:
          <input
            type="text"
            id="mname"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.mname}
          />
          Last Name:
          <input
            type="text"
            id="lname"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.lname}
          />
          Email ID:
          <input
            type="text"
            id="email"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.email}
          />
          Phone No.:
          <input
            type="number"
            id="phone"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.phone}
          />
          Aadhar No.:
          <input
            type="number"
            id="aadhar"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.aadhar}
          />
          Date of Birth:
          <input
            type="date"
            id="dob"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.dob}
          />
          Address:
          <textarea
            type=""
            id="address"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.address}
          />
          Home Type:
          <div className="flex gap-2">
            <select
              id="home"
              className="border border-neutral-border p-1 rounded-sm"
              onChange={handleChange}
              value={formData.home}
            >
              <option value="permanent">Permanent</option>
              <option value="rent">Rental</option>
            </select>
          </div>
          Blood Group:
          <input
            type="text"
            id="bloodgroup"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.bloodgroup}
          />
          Gender:
          <div className="flex gap-2">
            <select
              id="gender"
              className="border border-neutral-border p-1 rounded-sm"
              onChange={handleChange}
              value={formData.gender}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          Marital Status:
          <div className="flex gap-2">
            <select
              id="mstatus"
              className="border border-neutral-border p-1 rounded-sm"
              onChange={handleChange}
              value={formData.mstatus}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
          Passport No:
          <input
            type="text"
            id="passport"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.passport}
          />
        </div>
        <div className="flex flex-col flex-1 gap-2">
          Degree:
          <input
            type="text"
            id="degree"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.degree}
          />
          Post:
          <input
            type="text"
            id="post"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.post}
          />
          Department:
          <select
            id="department"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.department}
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          Status:
          <div className="flex gap-2">
            <select
              id="status"
              className="border border-neutral-border p-1 rounded-sm"
              onChange={handleChange}
              value={formData.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>
          <b>Date of joining:</b>
          <input
            type="date"
            id="doj"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.doj}
          />
          Probation Months:
          <input
            type="number"
            id="bonusMonths"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.bonusMonths}
          />
          Date of Probation:
          <input
            type="date"
            id="bonus_date"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.bonus_date}
          />
          Leave Balance:
          <input
            type="number"
            id="leave_balance"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.leave_balance}
          />
          <b>Password:</b>
          <input
            type="text"
            id="password"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.password}
          />
          <b> Pancard No.:</b>
          <input
            type="text"
            id="pancard"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.pancard}
          />
          <b> Account Number:</b>
          <input
            type="text"
            id="accno"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.accno}
          />
          <b> Bank Name:</b>
          <input
            type="text"
            id="bank_name"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.bank_name}
          />
          <b> Branch Name:</b>
          <input
            type="text"
            id="branch"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.branch}
          />
          <b> IFSC code:</b>
          <input
            type="text"
            id="ifsc"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.ifsc}
          />
          <b> Account Holder Name:</b>
          <input
            type="text"
            id="holder_name"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.holder_name}
          />
          Basic Salary:
          <input
            type="number"
            id="bsalary"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.bsalary}
          />
          House Rent allowance:
          <input
            type="number"
            id="hra"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.hra}
          />
          Travel Allowance:
          <input
            type="number"
            id="ta"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.ta}
          />
          Special Allowance:
          <input
            type="number"
            id="sa"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.sa}
          />
          Medical Allowance:
          <input
            type="number"
            id="ma"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.ma}
          />
          Mediclaim & PA:
          <input
            type="number"
            id="mpa"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.mpa}
          />
          Leave Travel Allowance:
          <input
            type="number"
            id="lta"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.lta}
          />
          PF Employee:
          <input
            type="number"
            id="pfempes"
            className="border border-neutral-border p-1 rounded-sm"
            onChange={handleChange}
            value={formData.pfempes}
          />
        </div>
      </form>
      <div className="flex justify-center ">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="p-3 bg-primary text-custom-white rounded-lg uppercase hover:bg-primary-dark disabled:opacity-80 w-48"
        >
          {loading ? "Loading..." : "Add Employee"}
        </button>
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
    </main>
  );
}
