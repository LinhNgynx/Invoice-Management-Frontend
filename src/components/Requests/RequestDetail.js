import React, {useContext} from 'react';
import axios from 'axios';
import moment from 'moment';

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

const RequestDetail = () => {
    return <div>
        <h1>Request Detail</h1>
    </div>
};

export default RequestDetail;
