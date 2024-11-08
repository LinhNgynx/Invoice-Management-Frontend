import React, { useContext, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

const RequestDetail = () => {
  const { isAdmin, isPurchaseTeam } = useContext(AuthContext);
  const location = useLocation();
  const { request } = location.state || {};
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  const uploadFile = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.put(
        `http://localhost:8080/api/requests/${id}/bills/`,
        formData,
      );
      if (res.status === 200) {
        toast.success('Upload bill successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteItem = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/requests/${request.id}`,
      );
      if (res.status === 200) {
        toast.success('Delete request successfully');
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateState = async state => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/requests/${request.id}`,
        {
          state,
        },
      );
      if (res.status === 200) {
        request.state = state;
        toast.success('Update state successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getStatusColor = state => {
    switch (state) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'ACCEPTED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">
          Request Detail - {request.id}
        </h1>

        <div className="flex flex-row justify-between">
          <div className="mb-6 w-1/4">
            <h2 className="text-lg font-semibold text-sky-700 mb-1">
              Request Information
            </h2>
            <div className="flex flex-row justify-between">
              <strong>Created By:</strong> {request.user.name}
            </div>
            <div className="flex flex-row justify-between">
              <strong>Created At:</strong>{' '}
              {moment(
                request.createdAt.map((val, index) =>
                  index === 1 ? val - 1 : val,
                ),
              ).format('DD/MM/YYYY HH:mm:ss')}
            </div>

            <div className="flex flex-row justify-between">
              <strong>Status:</strong>{' '}
              <span className={getStatusColor(`${request.state}`)}>
                {request.state}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-sky-700 mb-1">
              Activity
            </h2>
            <p className="text-gray-700">
              <strong>Last Modified At:</strong>{' '}
              {moment(
                request.updatedAt.map((val, index) =>
                  index === 1 ? val - 1 : val,
                ),
              ).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-sky-700 mb-1">
            Product Detail
          </h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-3 px-6 text-center font-semibold">ID</th>
                <th className="py-3 px-6 font-semibold">Name</th>
                <th className="py-3 px-6 font-semibold">Amount</th>
                <th className="py-3 px-6 font-semibold">Price</th>
                <th className="py-3 px-6 font-semibold">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {request.products.map(product => (
                <tr key={product.id} className="border-b last:border-none">
                  <td className="py-4 px-6 text-center">{product.id}</td>
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.quantity}</td>
                  <td className="py-4 px-6">{product.price.toFixed(2)} VND</td>
                  <td className="py-4 px-6">
                    {(product.quantity * product.price).toFixed(2)} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Details */}
        <div className="mb-6 w-1/4">
          <h2 className="text-lg font-semibold text-sky-700 mb-1">Cost</h2>
          <div className="flex flex-row justify-between">
            <strong>Deposit:</strong>{' '}
            <span className="text-orange-600">
              {request.deposit.toFixed(2)} VND
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <strong>Total Price:</strong>{' '}
            <span className="text-green-600 font-medium text-lg">
              {request.totalPrice.toFixed(2)} VND
            </span>
          </div>
        </div>

        <div className="">
          <div className="flex flex-row items-center">
            <h2 className="text-lg font-semibold text-sky-700 mr-10">Bills</h2>
            {isPurchaseTeam() && request.state === 'ACCEPTED' && (
              <button
                className="text-blue-500"
                onClick={() => {
                  uploadRef.current.click();
                }}
              >
                <ArrowUpTrayIcon className="w-6 h-6" />
                <input
                  ref={uploadRef}
                  type="file"
                  className="hidden"
                  onChange={event => {
                    let file = event.target.files[0];
                    uploadFile(request.id, file);
                  }}
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-end">
          {isAdmin() && request.state === 'PENDING' && (
            <div className="flex gap-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                onClick={() => updateState('ACCEPTED')}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                onClick={() => updateState('REJECTED')}
              >
                Decline
              </button>
            </div>
          )}

          {isPurchaseTeam() && request.state === 'PENDING' && (
            <div className="flex gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                onClick={() => deleteItem()}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
