import React, { useState, useEffect } from "react";

const StorageStats = () => {
  const [storageStats, setStorageStats] = useState([]);
  const [totalStorage, setTotalStorage] = useState(0);

  useEffect(() => {
    fetchStorageStats();
  }, []);
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const fetchStorageStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin-auth/storage-stats`
      );
      if (response.ok) {
        const data = await response.json();
        setStorageStats(data);
        calculateTotalStorage(data);
      } else {
        console.error("Failed to fetch storage stats");
      }
    } catch (error) {
      console.error("Error fetching storage stats:", error);
    }
  };

  const calculateTotalStorage = (data) => {
    const total = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.size,
      0
    );
    setTotalStorage(total);
  };

  return (
    <div className="max-w-screen-md h-64 overflow-y-auto">
      <table className="w-full mt-0 border-collapse border border-gray-200">
        <thead className="bg-slate-300">
          <tr>
            <th className="py-2 px-4 text-sm text-center">Collection Name</th>
            <th className="py-2 px-4 text-sm text-center">
              Storage Consumed (bytes)
            </th>
          </tr>
        </thead>
        <tbody>
          {storageStats.map((collection, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="py-2 px-4 text-sm text-center">
                {collection.name}
              </td>
              <td className="py-2 px-4 text-sm text-center">
                {collection.size}
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-200">
            <td className="py-2 px-4 text-sm text-center font-bold">Total</td>
            <td className="py-2 px-4 text-sm text-center font-bold">
              {totalStorage}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StorageStats;
