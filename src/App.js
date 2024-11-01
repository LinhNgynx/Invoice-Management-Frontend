import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashBoard";
import PurchaseDashboard from "./pages/PurchaseDashBoard";
import AdminStatistics from "./components/Statistics/AdminStatistics";
import RequestList from "./components/Requests/RequestList";
import CreateRequest from "./components/Requests/CreateRequest";
import SaveBill from "./components/Requests/SaveBill";
import PurchaseStatistics from "./components/Statistics/PurchaseStatistics";
import Logout from "./components/LogOut/LogOut";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <PrivateRoute element={<AdminDashboard />} requiredRole="admin" />
            }
          >
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="requests" element={<RequestList />} />
            <Route path="logout" element={<Logout />} />
          </Route>
          <Route
            path="/purchase/dashboard/*"
            element={
              <PrivateRoute element={<PurchaseDashboard />} requiredRole="purchase" />
            }
          >
            <Route path="create-request" element={<CreateRequest />} />
            <Route path="save-bill" element={<SaveBill />} />
            <Route path="statistics" element={<PurchaseStatistics />} />
            <Route path="logout" element={<Logout />} />
          </Route>
          <Route
            path="/purchase/dashboard"
            element={
              <PrivateRoute
                element={<PurchaseDashboard />}
                requiredRole="purchase"
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
