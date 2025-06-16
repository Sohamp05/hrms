import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { PiSignOutBold } from "react-icons/pi";
import { MdAccountCircle } from "react-icons/md";
import { IoMdHome } from "react-icons/io";

export default function HamburgerMenu({ handleSignOut, handleSignOutEmp }) {
  const { currentUser } = useSelector((state) => state.user);
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
    <div className="flex items-center justify-between relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-neutral-text-light focus:outline-none focus:text-neutral-text"
      >
        <BsFillGrid3X3GapFill className="h-6 w-6" />
      </button>
      {menuOpen && (
        <div className="absolute mt-40 w-44 bg-custom-white border border-neutral-border divide-y divide-neutral-border rounded shadow-lg right-0">
          {/* Account Link for Admin */}
          {currentUser && !currentUserEmp && (
            <Link
              to="/home/account"
              onClick={() => setMenuOpen(false)}
              className="flex px-4 py-2 text-sm text-neutral-text hover:bg-neutral-bg-medium gap-2.5"
            >
              <MdAccountCircle className="mt-1 scale-125"/> Account
            </Link>
          )}

          {/* Employee Menu */}
          {currentUserEmp ? (
            <React.Fragment>
              <Link to="/employee-home" onClick={() => setMenuOpen(false)}>
                <li className="px-4 py-2 text-sm text-neutral-text hover:bg-neutral-bg-medium flex gap-2">
                  <IoMdHome className="mt-0.5 scale-125" />Home
                </li>
              </Link>
              <span
                onClick={() => {
                  handleSignOutEmp();
                  setMenuOpen(false);
                }}
                className="text-error cursor-pointer px-4 py-2 text-sm hover:bg-neutral-bg-medium flex gap-2"
              >
                <PiSignOutBold className="mt-1"/>Sign out
              </span>
            </React.Fragment>
          ) : currentUser ? ( 
            /* Admin Menu (Home and Sign Out) - only if not an employee */
            <React.Fragment>
              <Link to="/home" onClick={() => setMenuOpen(false)}>
                <li className="px-4 py-2 text-sm text-neutral-text hover:bg-neutral-bg-medium flex gap-2">
                  <IoMdHome className="mt-0.5 scale-125" />Home
                </li>
              </Link>
              <span
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="text-error cursor-pointer px-4 py-2 text-sm hover:bg-neutral-bg-medium flex gap-2"
              >
                <PiSignOutBold className="mt-1"/>Sign out
              </span>
            </React.Fragment>
          ) : (
            /* Sign In Link - if neither admin nor employee */
            <li className="px-4 py-2 text-sm text-neutral-text hover:bg-neutral-bg-medium">
              <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            </li>
          )}
        </div>
      )}
    </div>
  );
}
