import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader'; // Import spinner

const PrivateRoute = ({ element, requiredRole }) => {
  const { checkUser } = useContext(AuthContext);
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      const user = await checkUser();
      if (user && user.role === requiredRole) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    verifyAccess();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} color="#4A90E2" loading={loading} />
      </div>
    );
  }

  return hasAccess ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
