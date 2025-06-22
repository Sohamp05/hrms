import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmpSlips from "../components/EmpSlips";
import EmpLeaves from "../components/EmpLeaves";
import axios from "axios";

export default function EmpHomeContent() {
  const { currentUserEmp } = useSelector((state) => state.employee);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/employee-auth/getLeaveBalance`,
          { empid: currentUserEmp.empid }
        );
        setLeaveBalance(response.data.leave_balance);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchLeaveBalance();
  }, [currentUserEmp.empid]);

  return (
    <div>
      <h1 className="text-4xl">Hi, {currentUserEmp.fname}!</h1>
      <br />
      <span className="font-bold">{currentUserEmp.empid}</span>
      <div />
      <span className="font-bold">{currentUserEmp.department}</span>
      <div />
      <span className="font-bold">{currentUserEmp.post}</span>
      <div />
      Leave Balance: <span className="font-bold">{leaveBalance}</span> <div />
      <br />
      <hr />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2">
          <EmpSlips empid={currentUserEmp.empid} />
        </div>
        <div className="lg:w-1/2 lg:pl-4 mt-4 lg:mt-0 overflow-y-auto max-h-sm">
          <EmpLeaves empid={currentUserEmp.empid} />
        </div>
      </div>
    </div>
  );
}
