import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const checkUser = async () => {
    const jwt = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/verifyJwt', {
        jwt,
      });
      if (res.status === 200) {
        const loginUser = res.data.items;
        setUser(loginUser);
        return loginUser;
      }
    } catch (error) {
      console.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
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
        isAdmin,
        isPurchaseTeam,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
