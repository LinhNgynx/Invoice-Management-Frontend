import React, {useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CheckIcon, XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/solid'
import moment from 'moment';

const updateState = async (id, state) => {

};

const RequestItem = ({item, index}) => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);

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
        <div className='flex-1'>{item.detail}</div>
        <div className='w-1/12'>{moment(item.createdAt).format('DD-MM-YYYY')}</div>
        <div className='w-1/6'>{item.user.name}</div>
        <div className='w-1/12'>{item.deposit}</div>
        <div className='w-1/12'>{item.totalPrice}</div>
        <div className='w-1/12 flex items-center'>
            <span className={statusClass}>{item.state}</span>
        </div>
        <div className='w-1/6 flex flex-row'>
            {isAdmin() && item.state === 'PENDING' && <button className='bg-green-500 text-white px-2 py-0 mr-2'>ACCEPT</button>}
            {isAdmin() && item.state === 'PENDING' && <button className='bg-red-500 text-white px-2 py-0'>DECLINE</button>}
            {isPurchaseTeam() && item.state !== 'PENDING' && <button className='bg-blue-500 text-white rounded-full'><ArrowUpTrayIcon className='size-6'/></button>}
            {isPurchaseTeam() && item.state === 'PENDING' && <button className='bg-red-500 text-white rounded-full ml-2'><TrashIcon className='size-6'/></button>}
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
