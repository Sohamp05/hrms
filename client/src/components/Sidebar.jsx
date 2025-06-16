import React from 'react';
import { Link } from 'react-router-dom';
import { IoPersonAdd, IoHomeSharp } from "react-icons/io5";
import { GrDocumentUpdate, GrView } from "react-icons/gr";
import { FaSearch, FaListUl } from "react-icons/fa";
import { BsBank2, BsCalendarEvent } from "react-icons/bs";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { HiDocumentSearch } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function Sidebar() {
  return (
    <div className="w-1/6 bg-neutral-bg-medium p-2 overflow-y-auto shadow-lg">
      <ul>
        <Link to="/home">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
          <span className="text-primary hover:text-primary-dark flex gap-3"><IoHomeSharp className='mt-1'/>Home</span>
          </li>
        </Link>
        <Link to="/home/add-employee">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
          <span className="text-primary hover:text-primary-dark flex gap-3"><IoPersonAdd className='mt-1'/>Add Employee</span>
          </li>
        </Link>
        <Link to="/home/update-employee">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3 line-clamp-1"><GrDocumentUpdate className='mt-1'/>Update Employee</span>
          </li>
        </Link>
        <Link to="/home/search-employee">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><FaSearch className='mt-1' />Search Employee</span>
          </li>
        </Link>
        <Link to="/home/list-employees">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><FaListUl className='mt-1'/>List Employees</span>
          </li>
        </Link>
        <Link to="/home/list-bank-details">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><BsBank2 className='mt-1'/>List Bank Details</span>
          </li>
        </Link>
        <Link to="/home/view-all-leaves">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><GrView className='mt-1'/>View Leaves</span>
          </li>
        </Link>
        <Link to="/home/leave-calendar">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><BsCalendarEvent className='mt-1'/>Leave Calendar</span>
          </li>
        </Link>
        <Link to="/home/generate-slip">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><AiTwotoneFileAdd className='mt-1 scale-125'/>Add Slip</span>
          </li>
        </Link>
        <Link to="/home/search-slip">
          <li className="mb-2 rounded-md p-2 hover:bg-primary-light transition-colors duration-300">
            <span className="text-primary hover:text-primary-dark flex gap-3"><HiDocumentSearch className='mt-1 scale-125'/>Search Slip</span>
          </li>
        </Link>
        <Link to="/home/">
          <li className="mb-2 rounded-md p-2 hover:bg-error transition-colors duration-300">
            <span className="text-primary hover:text-custom-white flex gap-3"><RiDeleteBin5Fill className='mt-1 scale-125'/>Delete Employee</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}
