import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';
import { formatPrice } from '../../utils';

const RequestItem = ({ item, index, setRequests, requests }) => {
  const { isAdmin, isPurchaseTeam } = useContext(AuthContext);
  const [deleted, setDeleted] = useState(false);
  const [state, setState] = useState(item.state);
  const [bills, setBills] = useState(item.bills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  if (item.createdAt[6] > 100) item.createdAt[6] = 0;

  let statusClass = '';
  switch (state) {
    case 'PENDING':
      statusClass += ' text-yellow-600';
      break;
    case 'ACCEPTED':
      statusClass += ' text-green-600';
      break;
    case 'REJECTED':
      statusClass += ' text-red-600';
      break;
    default:
      statusClass += ' text-gray-500';
  }

  const deleteItem = async id => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/requests/${id}`,
      );
      if (res.status === 200) {
        setRequests(requests.filter(request => request.id !== id));
        toast.success('Delete request successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

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
        if (res.data?.items) {
          setBills([...bills, res.data.items]);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

  const deleteBill = async id => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/requests/bills/${id}`,
      );
      if (res.status === 200) {
        setBills(bills.filter(b => b.id !== id));
        toast.success('Delete bill successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

  const updateState = async (id, state) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/requests/${id}`, {
        state,
      });
      if (res.status === 200) {
        item.state = state;
        toast.success('Update state successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

  return (
    <tbody>
      <tr className="border-b last:border-none">
        <td className="py-4 px-6 text-center">{item.id}</td>
        <td
          className="py-4 px-6 text-sky-500 hover:text-sky-700 cursor-pointer"
          onClick={() => {
            navigate(`${item.id}`, { state: { request: item } });
          }}
        >
          {item.detail}
        </td>
        <td className="py-4 px-6">
          {moment(item.createdAt).format('DD/MM/YYYY H:mm:ss')}
        </td>
        <td className="py-4 px-6">{item.user.name}</td>
        <td className="py-4 px-6">{formatPrice(item.deposit)}</td>
        <td className="py-4 px-6">{formatPrice(item.totalPrice)}</td>
        <td className="py-4 px-6 text-center">
          <span className={statusClass}>{state}</span>
        </td>
        <td className="py-4 px-6">
          <div className="flex gap-2 justify-center">
            {isAdmin() && state === 'PENDING' && (
              <div className="flex space-x-2">
                <button
                  className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                  onClick={() => {
                    updateState(item.id, 'ACCEPTED');
                    setState('ACCEPTED');
                  }}
                >
                  Accept
                </button>
                <button
                  className="flex items-center bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                  onClick={() => {
                    updateState(item.id, 'REJECTED');
                    setState('REJECTED');
                  }}
                >
                  Decline
                </button>
              </div>
            )}

            {isPurchaseTeam() && state === 'ACCEPTED' && (
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
                    uploadFile(item.id, file);
                  }}
                />
              </button>
            )}
            {state === 'ACCEPTED' && (
              <button
                className="text-blue-500"
                onClick={() => setIsModalOpen(true)}
              >
                <ArrowDownTrayIcon className="w-6 h-6" />
              </button>
            )}
            {isPurchaseTeam() && state === 'PENDING' && (
              <button
                className="text-red-500"
                onClick={() => {
                  deleteItem(item.id);
                  setDeleted(true);
                }}
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
          </div>
          <DownloadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            {bills.length > 0 ? (
              bills.map((bill, index) => {
                return (
                  <div key={index} className="flex flex-row gap-2 mb-1">
                    <a
                      className="text-sky-500 hover:text-sky-700 text-ellipsis flex-1"
                      href={`http://localhost:8080/api/requests/bills/${bill.id}`}
                    >
                      {bill.file}
                    </a>
                    <button
                      className="text-red-500"
                      onClick={() => deleteBill(bill.id)}
                    >
                      <TrashIcon className="size-6" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No bill uploaded</p>
            )}
          </DownloadModal>
        </td>
      </tr>
    </tbody>
  );
};

const RequestItemHeader = () => {
  return (
    <thead className="bg-gray-200">
      <tr>
        <th className="py-3 px-6 text-center">ID</th>
        <th className="py-3 px-6">Detail</th>
        <th className="py-3 px-6 text-center">Created at</th>
        <th className="py-3 px-6">Created by</th>
        <th className="py-3 px-6 text-center">Deposit</th>
        <th className="py-3 px-6 text-center">Total price</th>
        <th className="py-3 px-6 text-center">Status</th>
        <th className="py-3 px-6 text-center">Actions</th>
      </tr>
    </thead>
  );
};

const DownloadModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 relative w-1/2">
        <div className="flex flex-row justify-between">
          <div className="font-semibold text-lg">Bills</div>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="my-4">{children}</div>
      </div>
    </div>
  );
};

export { RequestItem, RequestItemHeader };
