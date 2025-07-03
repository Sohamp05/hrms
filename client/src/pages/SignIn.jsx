import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to navigate from one page to another
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
  resetAuthState,
} from "../redux/user/userSlice";
import {
  setAuthLoadingState,
  getAuthLoadingState,
  clearAuthLoadingState,
} from "../utils/authStateManager";

export default function SigIn() {
  // to handle change in form data
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user);
  // Log when component renders and the loading state from Redux
  console.log(
    "[AdminSignIn] Component rendering. Loading state from Redux:",
    loading,
    "Error state:",
    error
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Reset loading state on component mount to prevent stuck loading
  useEffect(() => {
    const persistedLoadingState = getAuthLoadingState("admin");

    if (loading || persistedLoadingState) {
      console.log(
        "[AdminSignIn] Component mounted with loading=true or persisted loading state, resetting state"
      );
      dispatch(resetAuthState());
      clearAuthLoadingState("admin");
    }
  }, []);

  const handleChange = (e) => {
    // Clear any previous errors when user starts typing
    if (error) {
      dispatch(resetAuthState());
    }
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // console.log(formData); // Original log, can be kept or removed

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[AdminSignIn] handleSubmit EVENT FIRED."); // LOG AT THE VERY TOP OF THE FUNCTION
    console.log(
      "[AdminSignIn] handleSubmit started. Current loading state from Redux is:",
      loading
    ); // Log current loading state when function starts

    // Prevent multiple submissions
    if (loading) {
      console.log("[AdminSignIn] Submission blocked - already loading");
      return;
    }

    try {
      dispatch(signInStart());
      setAuthLoadingState(true, "admin");
      console.log(
        "[AdminSignIn] signInStart dispatched. Loading should be true via Redux state if reducer ran."
      );
      const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
      console.log("[AdminSignIn] API_BASE_URL:", API_BASE_URL);
      console.log(
        "[AdminSignIn] FormData being sent:",
        JSON.stringify(formData)
      );

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout

      const res = await fetch(`${API_BASE_URL}/api/admin-auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(
        "[AdminSignIn] Fetch call made. Response status:",
        res.status,
        "Status text:",
        res.statusText
      );

      const data = await res.json();
      console.log("[AdminSignIn] Response data parsed:", data);

      if (data.success === false) {
        console.error(
          "[AdminSignIn] API returned success:false. Message:",
          data.message
        );
        dispatch(signInFailure(data.message));
        clearAuthLoadingState("admin");
        console.log("[AdminSignIn] signInFailure dispatched.");
        return;
      }
      console.log(
        "[AdminSignIn] API returned success:true. Dispatching signInSuccess."
      );
      dispatch(signInSuccess(data));
      clearAuthLoadingState("admin");
      console.log(
        "[AdminSignIn] signInSuccess dispatched. Navigating to /home..."
      );
      navigate("/home");
      console.log("[AdminSignIn] Navigation to /home attempted.");
    } catch (error) {
      console.error(
        "[AdminSignIn] Error in handleSubmit catch block:",
        error.message,
        error
      );

      // Handle different types of errors
      if (error.name === "AbortError") {
        dispatch(signInFailure("Request timed out. Please try again."));
        console.log("[AdminSignIn] Request aborted due to timeout");
      } else if (error.message === "Failed to fetch") {
        dispatch(
          signInFailure(
            "Network error. Please check your connection and try again."
          )
        );
        console.log("[AdminSignIn] Network error detected");
      } else {
        dispatch(signInFailure(error.message));
      }
      clearAuthLoadingState("admin");
      console.log("[AdminSignIn] signInFailure dispatched from catch block.");
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
        {loading && (
          <button
            type="button"
            onClick={() => {
              console.log("[AdminSignIn] Manual reset triggered");
              dispatch(resetAuthState());
              clearAuthLoadingState("admin");
            }}
            className="bg-gray-500 text-white p-2 rounded-lg text-sm hover:bg-gray-600"
          >
            Cancel / Reset
          </button>
        )}
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
