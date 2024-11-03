import React, {useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CheckIcon, XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/solid'

const RequestItem = ({item, index}) => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);

    let mainClass = 'flex flex-row gap-2 p-2';
    if (index % 2) {
        mainClass += ' bg-gray-200';
    }

    let statusClass = 'rounded-full text-white px-2 py-1 text-xs';
    switch (item.status) {
        case 'pending':
            statusClass += ' bg-yellow-500';
            break;
        case 'approved':
            statusClass += ' bg-green-500';
            break;
        case 'rejected':
            statusClass += ' bg-red-500';
            break;
        default:
            statusClass += ' bg-gray-500';
    }
    return <div className={mainClass}>
        <div className='w-1/12'>{item.id}</div>
        <div className='flex-1'>{item.detail}</div>
        <div className='w-1/12'>{item.createdAt}</div>
        <div className='w-1/12'>{item.user.name}</div>
        <div className='w-1/12'>{item.deposit}</div>
        <div className='w-1/12'>{item.totalPrice}</div>
        <div className='w-1/12 flex items-center'>
            <span className={statusClass}>{item.status}</span>
        </div>
        <div className='w-1/12 flex flex-row'>
            {isAdmin() && <button className='bg-green-500 text-white rounded-full mr-2'><CheckIcon className='size-6'/></button>}
            {isAdmin() && <button className='bg-red-500 text-white rounded-full'><XMarkIcon className='size-6'/></button>}
            {isPurchaseTeam() && <button className='bg-blue-500 text-white rounded-full'><ArrowUpTrayIcon className='size-6'/></button>}
            {isPurchaseTeam() && <button className='bg-red-500 text-white rounded-full ml-2'><TrashIcon className='size-6'/></button>}
        </div>
    </div>
};

const RequestItemHeader = () => {
    const { isAdmin, isPurchaseTeam } = useContext(AuthContext);

    return <div className='flex flex-row gap-2 mt-2 bg-gray-200 p-2 font-bold'>
        <div className='w-1/12'>ID</div>
        <div className='flex-1'>Detail</div>
        <div className='w-1/12'>Created at</div>
        <div className='w-1/12'>Created by</div>
        <div className='w-1/12'>Deposit</div>
        <div className='w-1/12'>Total price</div>
        <div className='w-1/12'>Status</div>
        <div className='w-1/12'>Action</div>
    </div>   
};

export {RequestItem, RequestItemHeader};
