import React, {useContext} from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CheckIcon, XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/solid'

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

const RequestItem = ({item, index}) => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);
    const navigate = useNavigate();

    item.createdAt[6] /= 10000000;

    let mainClass = 'flex flex-row gap-2 p-2';
    if (index % 2) {
        mainClass += ' bg-gray-200';
    }

    let statusClass = 'rounded-full text-white px-2 py-1 text-xs';
    switch (item.state) {
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
            <span className={statusClass}>{item.state}</span>
        </div>
        <div className='w-1/6 flex flex-row'>
            {isAdmin() && item.state === 'PENDING' && <button 
                className='bg-green-500 text-white px-2 py-0 mr-2'
                onClick={() => updateState(item.id, 'ACCEPTED')}
            >
                ACCEPT
            </button>}
            {isAdmin() && item.state === 'PENDING' && <button 
                className='bg-red-500 text-white px-2 py-0'
                onClick={() => updateState(item.id, 'REJECTED')}
            >
                DECLINE
            </button>}
            {isPurchaseTeam() && item.state !== 'PENDING' && <button className='text-blue-500'><ArrowUpTrayIcon className='size-6'/></button>}
            {isPurchaseTeam() && item.state === 'PENDING' && <button 
                className='text-red-500'
                onClick={() => deleteItem(item.id)}
            >
                <TrashIcon className='size-6'/>
            </button>}
        </div>
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

export {RequestItem, RequestItemHeader};
