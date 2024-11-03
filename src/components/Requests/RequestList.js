import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {RequestItem, RequestItemHeader} from './RequestItem';

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
