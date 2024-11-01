import React, { createContext, useState } from 'react';
import predefinedUsers from '../db/user';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const login = async (credentials) => {
    const foundUser = predefinedUsers.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password &&
        u.role === credentials.role
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    } else {
      console.error('Login failed: Invalid credentials or role mismatch');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isPurchaseTeam = () => {
    return user && user.role === 'purchase';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isPurchaseTeam }}>
      {children}
    </AuthContext.Provider>
  );
};
