import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const AdminDashboard = () => {
  const navs = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Requests', path: 'requests' },
    { name: 'User Management', path: 'users' },
    { name: 'Category and Product', path: 'products' },
  ];

  return (
    <Layout navs={navs}>
      <Outlet />
    </Layout>
  );
};

export default AdminDashboard;
