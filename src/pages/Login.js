/* eslint-disable */
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async credentials => {
    try {
      const res = await axios.post(
        'https://invoice-backend-v1.onrender.com/api/auth/logIn',
        credentials,
      );
      if (res.status === 200) {
        const loginUser = res.data.items;
        localStorage.setItem('token', loginUser.jwt);
        setUser(loginUser);
        if (res.data.items.role === 'MANAGER') {
          navigate('/manager/requests');
        } else {
          navigate('/member/requests');
        }
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-10">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            name="username"
            type="text"
            placeholder="User name"
            value={credentials.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
