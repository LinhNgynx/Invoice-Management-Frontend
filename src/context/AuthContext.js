import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user && user.role === 'MANAGER';
  };

  const isPurchaseTeam = () => {
    return user && user.role === 'MEMBER';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAuthenticated,
        isAdmin,
        isPurchaseTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
