import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to navigate from one page to another
import { useDispatch, useSelector } from "react-redux";
import { signInStartEmp, signInFailureEmp, signInSuccessEmp} from "../redux/employee/employeeSlice";

export default function EmpSigIn() {
  // to handle change in form data
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state)=> state.employee);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStartEmp());

      const res = await fetch("/api/employee-auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });
      const data = await res.json(); 

      if (data.success === false) {
        dispatch(signInFailureEmp(data.message));
        return;
      }
      dispatch(signInSuccessEmp(data))
      navigate('/employee-home');
      console.log(data);
    } 
    catch (error) {
      dispatch(signInFailureEmp(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Employee Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Employee ID"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="empid"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="bg-primary text-custom-white p-3 rounded-lg uppercase 
        hover:bg-primary-dark disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Link to={"/"}>
          <span className="text-primary hover:text-primary-dark">HR Login</span>
        </Link>
      </form>
      {error && <p className="text-error mt-5">{error}</p>}
    </div>
  );
}
