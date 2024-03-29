import React,{useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function ViewLeave() {
    const navigate= useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    empRef: '',
    fromDate: '',
    toDate: '',
    days: '',
    reason: '',
    status: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`/api/leave/get-leave/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error('Failed to fetch leave data');
        }
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaveData();
  }, [id]);

  

  return (
    <div>
      <form >
        <div className="mb-4">
          <label className="block mb-2">Employee Reference:</label>
          <input
            type="text"
            name="empRef"
            value={formData.empRef}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Number of Days:</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Reason:</label>
          <textarea
            name="reason"
            value={formData.reason}
            readOnly
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            readOnly
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          >
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="pending">pending</option>
          </select>
        </div>
      </form>
    </div>
  );
}
