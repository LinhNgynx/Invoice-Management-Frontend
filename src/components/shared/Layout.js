import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children, navs, pathName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const doLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold text-center border-b border-gray-700">
          Invoice Active
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navs.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`px-4 py-2 rounded transition duration-200 ${
                location.pathname === '/' + pathName + '/' + item.path
                  ? 'bg-gray-700 font-semibold'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Invoice Management System</h1>
          <div className="flex items-center space-x-4">
            <div className="">{user.name}</div>
            <button onClick={doLogout}>
              <IoLogOutOutline className="text-2xl" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
