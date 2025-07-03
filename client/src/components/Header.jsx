import React from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import AdminNotifications from "./AdminNotifications";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
} from "../redux/user/userSlice";
import {
  deleteUserFailureEmp,
  deleteUserSuccessEmp,
  signOutFailureEmp,
  signOutStartEmp,
} from "../redux/employee/employeeSlice";
import logo from "../assets/SetPointAsiringEminence.png"; // correct relative path

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`${API_BASE_URL}/api/admin-auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleSignOutEmp = async () => {
    try {
      dispatch(signOutStartEmp());
      const res = await fetch(`${API_BASE_URL}/api/employee-auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailureEmp(data.message));
        return;
      }
      dispatch(deleteUserSuccessEmp(data));
    } catch (error) {
      dispatch(signOutFailureEmp(error.message));
    }
  };

  return (
    <div className="bg-custom-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="SetPoint Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="font-bold text-xl sm:text-2xl md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl">
            <span className="text-neutral-text-light">Set</span>
            <span className="text-primary">Point</span>
          </h1>
        </div>

        <ul className="flex gap-4 items-center">
          {/* Show admin notifications only for admin users */}
          {currentUser && (
            <li>
              <AdminNotifications />
            </li>
          )}
          <li>
            <HamburgerMenu
              handleSignOut={handleSignOut}
              handleSignOutEmp={handleSignOutEmp}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
