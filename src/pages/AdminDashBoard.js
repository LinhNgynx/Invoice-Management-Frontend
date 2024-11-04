import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const AdminDashboard = () => {
  const navs = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Requests', path: 'requests' },
    { name: 'Member Management', path: 'members' },
    { name: 'Category and Product', path: 'products' },
  ];

  return (
    <Layout navs={navs} pathName={'manager'}>
      <Outlet />
    </Layout>
  );
};

export default AdminDashboard;
