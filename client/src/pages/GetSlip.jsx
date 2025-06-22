import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import logo from "../assets/SetPointAsiringEminence.png";
import "../print.css";

const GetSlip = () => {
  const { empRef, month } = useParams();
  const [slip, setSlip] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/slip/get-slip/${empRef}/${month}`)
      .then((response) => response.json())
      .then((data) => setSlip(data))
      .catch((error) => console.error("Error fetching slip:", error));
  }, [empRef, month]);

  if (!slip) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1); // Month is zero-indexed in JavaScript
    const formattedMonth = date.toLocaleString("en-US", { month: "short" });
    const formattedYear = date.toLocaleString("en-US", { year: "2-digit" });
    return `${formattedMonth}-${formattedYear}`;
  };

  if (!slip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <div className="flex justify-between">
        <div className="flex flex-ROW">
          <img src={logo} alt="Image Description" className="w-32 h-32" />
          <p className="mt-7 text-slate-800 font-bold">
            ENGINEERING <br /> SERVICES <br /> (LLP)
          </p>
        </div>
        <div className="mt-2 ml-4 font-semibold text-right text-blue-800">
          Rev. 01 <br />
          DOI : {formatDate(slip.doi)} <br />
          RESTRICTED
        </div>
      </div>
      <table className="w-full border-separate border-spacing-1">
        <tbody>
          <tr>
            <td className="px-4 py-2">Employee ID:</td>
            <td className="px-4 py-1 border border-gray-300 rounded-lg ">
              {slip.empRef}
            </td>
            <td className="px-4 py-2">Net Paid Days:</td>
            <td className="px-4 py-1 border border-gray-300 rounded-lg ">
              {slip.npd}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Employee Name:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.ename}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Designation:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.des}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Date of Joining:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {formatDate(slip.djoin)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Month:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {formatMonth(slip.month)}
            </td>
          </tr>
          {/* <tr className="h-2"></tr> Adding space between sections */}
          <tr>
            <td>
              <span className=" px-2 font-bold underline">SALARY DETAILS</span>
            </td>
          </tr>

          <tr>
            <td className="px-4 py-2">Basic:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.bsal}
            </td>
            <td className="px-4 py-2">Professional Tax:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.ptax}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">House Rent Allowance:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.hra}
            </td>
            <td className="px-4 py-2">PF@Employer:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.pfemper}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">City Compensatory Allowance:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.cca}
            </td>
            <td className="px-4 py-2">PF@Employees:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.pfempes}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Mediclaim & PA:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.mpa}
            </td>
            <td className="px-4 py-2">Mediclaim & PA:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.mpa}
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td className="px-4 py-2">Gross Salary:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.totearn}
            </td>
            <td className="px-4 py-2">Total Deductions:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.totded}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Net Salary:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.totsal}
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <span className=" px-2 font-bold underline">LEAVE DETAILS</span>
            </td>
          </tr>

          <tr>
            <td className="px-4 py-2">Allotted Leaves:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.al}
            </td>
            <td className="px-4 py-2">Leaves Taken:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.lt}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Total Days:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.td}
            </td>
            <td className="px-4 py-2">Balance Leaves:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.bl}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Enchashed Leaves:</td>
            <td className="px-4 py-1 rounded-lg border border-gray-300">
              {slip.el}
            </td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-1"></td>
          </tr>
        </tbody>
      </table>
      <div className="mt-24 text-slate-950">
        Note: Encashment of leaves will be done in the month of March of the
        current Financial year.
      </div>
      <p className="mt-0 mb-3 text-orange-600">
        {" "}
        This is digitally generated slip, signature is not required
      </p>
      <div className="flex flex-row gap-16 justify-center text-blue-800 font-semibold">
        <div>Page 1 of 1</div>
        <div className="text-right text-sm">
          Reg. Office: 701/D Wing, Pawapuri CHSL, Ashok Nagar, Kandivali(E)
          Mumbai-400101 <br />
          Engg. Office: 33|73, Kalpataru Avenue, Opp ESIS Hospital, Akurli Road,
          Kandivali(E) <br />
          Mumbai-400101, Tel: +91 22 4978 1259
        </div>
      </div>
      <button
        onClick={() => window.print()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 printbutton"
      >
        Print Slip
      </button>
    </div>
  );
};

export default GetSlip;
