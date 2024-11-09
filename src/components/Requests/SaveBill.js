/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';

const SaveBill = () => {
  const [bill, setBill] = useState({ supplier: '', amount: '', date: '' });

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bills', bill);
      // Handle success, e.g., show a success message
    } catch (error) {
      console.error('Error saving bill', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="supplier" type="text" placeholder="Supplier" onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" onChange={handleChange} required />
      <input name="date" type="date" onChange={handleChange} required />
      <button type="submit">Save Bill</button>
    </form>
  );
};

export default SaveBill;
