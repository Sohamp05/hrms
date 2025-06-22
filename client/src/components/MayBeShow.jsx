import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MayBeShow = ({ children }) => {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    // console.log(location)
    if (location.pathname.includes(`${API_BASE_URL}/api/slip/get-slip/`)) {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [location]);
  return <div>{showNavBar && children}</div>;
};

export default MayBeShow;
