import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import EmployeeNotifications from "../components/EmployeeNotifications";

export default function EmpHome() {
  const { currentUserEmp } = useSelector((state) => state.employee);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="p-4 overflow-y-auto">
      {/* Include employee notifications component */}
      <EmployeeNotifications />
      <div className="flex items-center justify-between mb-4" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="text-slate-600 focus:outline-none focus:text-slate-800"
        >
          <GiHamburgerMenu className="h-6 w-6" />
        </button>
        {menuOpen && (
          <div className="absolute mt-32 w-60 bg-slate-200 border border-gray-200 divide-y divide-gray-200 rounded shadow-lg">
            <Link
              to="/employee-home/request-leave"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Request Leave
            </Link>
            <Link
              to={`/employee-home/view-details/${currentUserEmp.empid}`}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Details
            </Link>
            <Link
              to="/employee-home"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              href="mailto:setpointengineerings@gmail.com"
            >
              Mail HR
            </Link>
          </div>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
