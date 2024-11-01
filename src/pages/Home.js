// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Our Invoice Management System!</h1>
      <button onClick={handleLoginRedirect} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Go to Login
      </button>
    </div>
  );
};

export default Home;
