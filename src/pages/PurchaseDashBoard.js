import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const PurchaseDashboard = () => {
  const navs = [
    { name: 'Requests', path: 'requests' },
    { name: 'Create Request', path: 'create-request' },
  ];

  return (
    <Layout navs={navs} pathName={'member'}>
      <Outlet />
    </Layout>
  );
};

export default PurchaseDashboard;
