import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { RequestItem, RequestItemHeader } from './RequestItem';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const RequestList = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const role = user.role;
      try {
        var res;
        if (role === 'MEMBER') {
          res = await axios.get(
            `https://invoice-backend-v1.onrender.com/api/requests/user/${user.id}`,
          );
        } else {
          res = await axios.get('https://invoice-backend-v1.onrender.com/api/requests/');
        }
        if (res.status) {
          setRequests(res.data.items);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Request List</h1>
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
