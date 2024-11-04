import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const PurchaseDashboard = () => {
  const navs = [
    { name: 'Create Request', path: 'create' },
    { name: 'Requests', path: 'requests' },
  ];

  return (
    <Layout navs={navs} pathName={'member'}>
      <Outlet />
    </Layout>
  );
};

export default PurchaseDashboard;
