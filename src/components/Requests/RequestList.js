import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RequestItem, RequestItemHeader } from './RequestItem';
import { toast, ToastContainer } from 'react-toastify';

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/requests/');
        setRequests(response.data.items);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Request List</h1>
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <RequestItemHeader />
          {requests.map((request, index) => (
            <RequestItem
              key={request.id}
              item={request}
              index={index}
              setRequests={setRequests}
              requests={requests}
            />
          ))}
        </table>
      </div>
    </div>
  );
};

export default RequestList;
