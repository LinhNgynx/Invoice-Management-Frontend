import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashBoard';
import PurchaseDashboard from './pages/PurchaseDashBoard';
import AdminStatistics from './components/Statistics/AdminStatistics';
import RequestList from './components/Requests/RequestList';
import CreateRequest from './components/Requests/CreateRequest';
import SaveBill from './components/Requests/SaveBill';
import PurchaseStatistics from './components/Statistics/PurchaseStatistics';
import Logout from './components/LogOut/LogOut';
import NotFound from './pages/NotFound';
import RequestDetail from './components/Requests/RequestDetail';
import MemberList from './components/Member/MemberList';
import Product from './components/Product/Product';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/manager/*"
            element={
              <PrivateRoute
                element={<AdminDashboard />}
                requiredRole="MANAGER"
              />
            }
          >
            <Route path="" element={<AdminStatistics />} />
            <Route path="requests" element={<RequestList />} />
            <Route path="members" element={<MemberList />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="products" element={<Product />} />
          </Route>
          <Route
            path="/member/*"
            element={
              <PrivateRoute
                element={<PurchaseDashboard />}
                requiredRole="MEMBER"
              />
            }
          >
            <Route path="create-request" element={<CreateRequest />} />
            <Route path="requests" element={<RequestList />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="save-bill" element={<SaveBill />} />
            <Route path="statistics" element={<PurchaseStatistics />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
