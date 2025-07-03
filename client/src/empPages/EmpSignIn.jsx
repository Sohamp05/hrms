import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to navigate from one page to another
import { useDispatch, useSelector } from "react-redux";
import {
  signInStartEmp,
  signInFailureEmp,
  signInSuccessEmp,
  resetAuthStateEmp,
} from "../redux/employee/employeeSlice";
import {
  setAuthLoadingState,
  getAuthLoadingState,
  clearAuthLoadingState,
} from "../utils/authStateManager";

export default function EmpSigIn() {
  // to handle change in form data
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.employee);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Reset loading state on component mount to prevent stuck loading
  useEffect(() => {
    const persistedLoadingState = getAuthLoadingState("employee");

    if (loading || persistedLoadingState) {
      console.log(
        "[EmpSignIn] Component mounted with loading=true or persisted loading state, resetting state"
      );
      dispatch(resetAuthStateEmp());
      clearAuthLoadingState("employee");
    }
  }, []);

  const handleChange = (e) => {
    // Clear any previous errors when user starts typing
    if (error) {
      dispatch(resetAuthStateEmp());
    }
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[EmpSignIn] handleSubmit EVENT FIRED.");

    // Prevent multiple submissions
    if (loading) {
      console.log("[EmpSignIn] Submission blocked - already loading");
      return;
    }

    try {
      dispatch(signInStartEmp());
      setAuthLoadingState(true, "employee");

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout

      const res = await fetch(`${API_BASE_URL}/api/employee-auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensure this line is present
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailureEmp(data.message));
        clearAuthLoadingState("employee");
        return;
      }
      dispatch(signInSuccessEmp(data));
      clearAuthLoadingState("employee");
      navigate("/employee-home");
      console.log(data);
    } catch (error) {
      console.error(
        "[EmpSignIn] Error in handleSubmit catch block:",
        error.message,
        error
      );

      // Handle different types of errors
      if (error.name === "AbortError") {
        dispatch(signInFailureEmp("Request timed out. Please try again."));
        console.log("[EmpSignIn] Request aborted due to timeout");
      } else if (error.message === "Failed to fetch") {
        dispatch(
          signInFailureEmp(
            "Network error. Please check your connection and try again."
          )
        );
        console.log("[EmpSignIn] Network error detected");
      } else {
        dispatch(signInFailureEmp(error.message));
      }
      clearAuthLoadingState("employee");
      console.log("[EmpSignIn] signInFailureEmp dispatched from catch block.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        {" "}
        Employee Sign In
      </h1>
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
        {loading && (
          <button
            type="button"
            onClick={() => {
              console.log("[EmpSignIn] Manual reset triggered");
              dispatch(resetAuthStateEmp());
              clearAuthLoadingState("employee");
            }}
            className="bg-gray-500 text-white p-2 rounded-lg text-sm hover:bg-gray-600"
          >
            Cancel / Reset
          </button>
        )}
        <Link to={"/"}>
          <span className="text-primary hover:text-primary-dark">HR Login</span>
        </Link>
      </form>
      {error && <p className="text-error mt-5">{error}</p>}
    </div>
  );
}
