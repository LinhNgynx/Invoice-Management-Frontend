// src/pages/Home.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { checkUser, isAdmin, isPurchaseTeam } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkJwt = async () => {
      const user = await checkUser();
      if (user) {
        if (user.role === 'MANAGER') {
          navigate('/manager/requests');
        } else {
          navigate('/member/requests');
        }
      } else {
        navigate('/login');
      }
    };

    checkJwt();
  }, [isAdmin, isPurchaseTeam]);

  return <div></div>;
};

export default Home;
