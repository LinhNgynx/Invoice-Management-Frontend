import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user, isAdmin, isPurchaseTeam } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isPurchaseTeam()) {
        navigate('/purchase/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, isPurchaseTeam, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (!success) {
      alert('Login failed. Please check your credentials and role.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <select name="role" value={credentials.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="purchase">Purchase Team</option>
      </select>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
