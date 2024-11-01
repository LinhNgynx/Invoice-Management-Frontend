import React, { useState } from 'react';
import axios from 'axios';

const CreateRequest = () => {
  const [request, setRequest] = useState({ item: '', quantity: '' });

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/requests', request);
      // Handle success, e.g., show a success message
    } catch (error) {
      console.error('Error creating request', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="item" type="text" placeholder="Item" onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required />
      <button type="submit">Create Request</button>
    </form>
  );
};

export default CreateRequest;
