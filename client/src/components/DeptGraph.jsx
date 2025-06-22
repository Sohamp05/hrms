import React, { useState, useEffect } from "react";
import { AgChartsReact } from "ag-charts-react";

export default function DeptGraph() {
  const [chartOptions, setChartOptions] = useState({
    data: [],
    series: [{ type: "bar", xKey: "department", yKey: "employees" }],
  });
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/crud/get-email`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const employeeData = await response.json();

        const departmentCounts = {};
        employeeData.forEach((employee) => {
          const department = employee.department;
          departmentCounts[department] =
            (departmentCounts[department] || 0) + 1;
        });

        const chartData = Object.entries(departmentCounts).map(
          ([department, count]) => ({
            department,
            employees: count,
          })
        );

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          data: chartData,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <AgChartsReact options={chartOptions} />;
}
