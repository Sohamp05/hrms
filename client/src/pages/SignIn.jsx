import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to navigate from one page to another
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SigIn() {
  // to handle change in form data
  const [formData, setFormData] = useState({});

  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

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
      dispatch(signInStart());
      const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
      const res = await fetch(`${API_BASE_URL}/api/admin-auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensure this line is present
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/home");
      console.log(data);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* mx auto sets the box in center */}
      <h1 className="text-3xl text-center font-semibold my-7">
        HR Manager Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email ID"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="email"
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
        <Link to={"/employee-signin"}>
          <span className="text-primary hover:text-primary-dark">
            Employee Login
          </span>
        </Link>
      </form>
      {error && <p className="text-error mt-5">{error}</p>}
    </div>
  );
}
