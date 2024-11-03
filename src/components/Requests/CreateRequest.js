import React, { useState } from 'react';
import axios from 'axios';

const CreateRequest = () => {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // const request: PurchaseRequestDTO = {
    //   productName,
    //   productQuantity,
    //   unitPrice,
    //   deposit,
    //   createdBy: 'User', // Replace this with actual user info
    //   createdAt: new Date(),
    // };

    // try {
    //   await createPurchaseRequest(request);
    //   alert('Request created successfully!');
    // } catch (error) {
    //   console.error(error);
    //   alert('Failed to create request.');
    // }
  };

  return (
    <div>
      <h1 className='text-rose-600 text-xl'>Customer and Order Details</h1>
      <div>
        <div className='flex justify-between w-1/2'>
          <span>Order ID</span>
          <span>106</span>
        </div>
        <div className='flex justify-between w-1/2'>
          <span>Order ID</span>
          <span>106</span>
        </div>
        <div className='flex justify-between w-1/2'>
          <span>Order ID</span>
          <span>106</span>
        </div>
      </div>
      <h1 className='text-rose-600 text-xl'>Add item into Cart</h1>
      <form onSubmit={handleSubmit} className="p-4 flex justify-between">
      <div className="mb-4">
        <label className="block text-gray-700">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Product Quantity</label>
        <input
          type="number"
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </div>
      <button type='button' className="bg-rose-500 text-white py-2 px-4 rounded">ADD ITEM</button>
    </form>
    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Create Request
      </button>
    </div>
  );
};

export default CreateRequest;
