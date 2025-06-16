import React, { useState, useEffect } from "react";

const ListEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    empid: "",
    fname: "",
    lname: "",
    post: "",
    department: "",
    status: "",
    doj: "",
    bonus_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crud/get");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchInputChange = (e, columnName) => {
    setSearchQueries({
      ...searchQueries,
      [columnName]: e.target.value,
    });
  };

  const filterEmployees = (employee) => {
    const hasSearchQuery = Object.values(searchQueries).some(query => query !== "");
    if (!hasSearchQuery) {
      return true;
    }
    for (const key in searchQueries) {
      if (
        searchQueries[key] !== "" &&
        employee[key].toLowerCase().includes(searchQueries[key].toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };
  

  return (
    <div className="container mx-auto px-1 py-1">
      <table className="min-w-full divide-y divide-neutral-border">
        <thead>
          <tr className="bg-neutral-bg-medium">
            <th>
              <input
                type="text"
                placeholder="Employee ID"
                value={searchQueries.empid}
                onChange={(e) => handleSearchInputChange(e, "empid")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="First Name"
                value={searchQueries.fname}
                onChange={(e) => handleSearchInputChange(e, "fname")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Last Name"
                value={searchQueries.lname}
                onChange={(e) => handleSearchInputChange(e, "lname")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Post"
                value={searchQueries.post}
                onChange={(e) => handleSearchInputChange(e, "post")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Department"
                value={searchQueries.department}
                onChange={(e) => handleSearchInputChange(e, "department")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Status"
                value={searchQueries.status}
                onChange={(e) => handleSearchInputChange(e, "status")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Date of Join"
                value={searchQueries.doj}
                onChange={(e) => handleSearchInputChange(e, "doj")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Bonus Date"
                value={searchQueries.bonus_date}
                onChange={(e) => handleSearchInputChange(e, "bonus_date")}
                className="px-4 py-2 w-full bg-transparent border-none focus:outline-none text-center"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter(filterEmployees)
            .map((employee) => (
              <tr key={employee._id} className="bg-custom-white hover:bg-neutral-bg-light">
                <td className="px-4 py-2 text-center">{employee.empid}</td>
                <td className="px-4 py-2 text-center">{employee.fname}</td>
                <td className="px-4 py-2 text-center">{employee.lname}</td>
                <td className="px-4 py-2 text-center">{employee.post}</td>
                <td className="px-4 py-2 text-center">{employee.department}</td>
                <td className="px-4 py-2 text-center">{employee.status}</td>
                <td className="px-4 py-2 text-center">{employee.doj}</td>
                <td className="px-4 py-2 text-center">{employee.bonus_date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployees;
