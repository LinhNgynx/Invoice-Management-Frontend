import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, isAdmin, isPurchaseTeam } = useContext(AuthContext);

  const hasAccess = () => {
    if (requiredRole === 'MANAGER') return isAdmin();
    if (requiredRole === 'MEMBER') return isPurchaseTeam();
    return false;
  };

  return isAuthenticated() && hasAccess() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
