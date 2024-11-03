import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {RequestItem, RequestItemHeader} from './RequestItem';

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/requests/');
        //setRequests(response.data);
        setRequests([
          {
            id: 1,
            detail: 'Request 1',
            createdAt: '2021-10-01',
            user: { name: 'User 1' },
            deposit: 1000,
            totalPrice: 5000,
            status: 'pending',
          },
          {
            id: 2,
            detail: 'Request 2',
            createdAt: '2021-10-02',
            user: { name: 'User 2' },
            deposit: 2000,
            totalPrice: 6000,
            status: 'approved',
          },
          {
            id: 3,
            detail: 'Request 3',
            createdAt: '2021-10-03',
            user: { name: 'User 3' },
            deposit: 3000,
            totalPrice: 7000,
            status: 'rejected',
          },
        ]);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 className='text-2xl font-bold'>Request List</h2>
      <RequestItemHeader/>
      {requests.map((request, index) => (
        <RequestItem key={request.id} item={request} index={index}/>
      ))}
    </div>
  );
};

export default RequestList;
