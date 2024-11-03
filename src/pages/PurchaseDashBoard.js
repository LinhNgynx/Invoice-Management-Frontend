import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const PurchaseDashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
        <h2>Purchase Team Dashboard</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <Link to="create-request">Create Request</Link>
          </li>
          <li>
            <Link to="requests">Request List</Link>
          </li>
          <li>
            <Link to="save-bill">Save Bill</Link>
          </li>
          <li>
            <Link to="statistics">Statistics</Link>
          </li>
          <li>
            <Link to="logout">Logout</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* Render the selected component here */}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
