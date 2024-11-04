import React, {useContext, useRef, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'

const updateState = async (id, state) => {
    try {
        await axios.put(`http://localhost:8080/api/requests/${id}`, { state });
    } catch (error) {
        console.error('Error updating request state', error);
    }
};

const deleteItem = async (id) => {
    try {
        await axios.delete(`http://localhost:8080/api/requests/${id}`);
    } catch (error) {
        console.error('Error deleting request', error);
    }
};

const uploadFile = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.put(`http://localhost:8080/api/requests/${id}/bills/`, formData);
    } catch (error) {
        console.error('Error uploading file', error);
    }
};

const RequestItem = ({item, index}) => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);
    const [deleted, setDeleted] = useState(false);
    const [state, setState] = useState(item.state);
    const [bills, setBills] = useState(item.bills);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const uploadRef = useRef(null);

    item.createdAt[6] /= 10000000;

    let mainClass = 'flex flex-row gap-2 p-2';
    if (index % 2) mainClass += ' bg-gray-200';
    if (deleted) mainClass += ' hidden';

    let statusClass = 'rounded-full text-white px-2 py-1 text-xs';
    switch (state) {
        case 'PENDING':
            statusClass += ' bg-yellow-500';
            break;
        case 'ACCEPTED':
            statusClass += ' bg-green-500';
            break;
        case 'REJECTED':
            statusClass += ' bg-red-500';
            break;
        default:
            statusClass += ' bg-gray-500';
    }
    return <div className={mainClass}>
        <div className='w-1/12'>{item.id}</div>
        <div className='flex-1 text-sky-500 hover:text-sky-700' onClick={() => {navigate(item.id)}}>{item.detail}</div>
        <div className='w-1/12'>{moment(item.createdAt).format('DD-MM-YYYY')}</div>
        <div className='w-1/6'>{item.user.name}</div>
        <div className='w-1/12'>{item.deposit}</div>
        <div className='w-1/12'>{item.totalPrice}</div>
        <div className='w-1/12 flex items-center'>
            <span className={statusClass}>{state}</span>
        </div>
        <div className='w-1/6 flex flex-row'>
            {isAdmin() && state === 'PENDING' && <button 
                className='bg-green-500 text-white px-2 py-0 mr-2'
                onClick={() => {
                    updateState(item.id, 'ACCEPTED');
                    setState('ACCEPTED');
                }}
            >
                ACCEPT
            </button>}
            {isAdmin() && state === 'PENDING' && <button 
                className='bg-red-500 text-white px-2 py-0'
                onClick={() => {
                    updateState(item.id, 'REJECTED');
                    setState('REJECTED');
                }}
            >
                DECLINE
            </button>}
            {isPurchaseTeam() && state === 'ACCEPTED' && <button 
                className='text-blue-500 mr-2'
                onClick={() => {uploadRef.current.click()}}
            >
                <ArrowUpTrayIcon className='size-6'/>
                <input ref={uploadRef} type='file' className='hidden' onChange={(event) => {
                    let file = event.target.files[0];
                    uploadFile(item.id, file);
                }}/>
            </button>}
            {state === 'ACCEPTED' && <button 
                className='text-blue-500'
                onClick={() => setIsModalOpen(true)}
            >
                <ArrowDownTrayIcon className='size-6'/>
            </button>}
            {isPurchaseTeam() && state === 'PENDING' && <button 
                className='text-red-500'
                onClick={() => {
                    deleteItem(item.id);
                    setDeleted(true);
                }}
            >
                <TrashIcon className='size-6'/>
            </button>}
        </div>
        <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {bills.length > 0 ? bills.map((bill, index) => {
                return <div key={index} className='flex flex-row gap-2'>
                    <a className='text-sky-500 hover:text-sky-700 text-ellipsis flex-1' 
                        href={`http://localhost:8080/api/requests/bills/${bill.id}`} 
                    >
                        {bill.file}
                    </a>
                    <button className='text-red-500' onClick={() => {
                        try {
                            axios.delete(`http://localhost:8080/api/requests/bills/${bill.id}`);
                            setBills(bills.filter(b => b.id !== bill.id));
                        } catch (error) {
                            console.error('Error deleting bill', error);
                        }
                    }}>
                        <TrashIcon className='size-6'/>
                    </button>
                </div>
            }) : <p>No bill uploaded</p>}
        </DownloadModal>
    </div>
};

const RequestItemHeader = () => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);

    return <div className='flex flex-row gap-2 mt-2 bg-gray-200 p-2 font-bold'>
        <div className='w-1/12'>ID</div>
        <div className='flex-1'>Detail</div>
        <div className='w-1/12'>Created at</div>
        <div className='w-1/6'>Created by</div>
        <div className='w-1/12'>Deposit</div>
        <div className='w-1/12'>Total price</div>
        <div className='w-1/12'>Status</div>
        <div className='w-1/6'>Action</div>
    </div>   
};

const DownloadModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 relative w-1/2">
          <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
            <XMarkIcon className="size-6" />
          </button>
          <div className="my-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

export {RequestItem, RequestItemHeader};
