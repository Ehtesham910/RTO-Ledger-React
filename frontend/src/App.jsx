import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Services from './pages/Services';
import ServiceRequests from './pages/ServiceRequests';
import Ledger from './pages/Ledger';
import CustomerLedger from './pages/CustomerLedger';
import Receipts from './pages/Receipts';
import ViewReceipt from './pages/ViewReceipt';
import Roles from './pages/Roles';
import Users from './pages/Users';
import Login from './pages/Login';

// Setup global axios interceptor
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="vehicles" element={<Vehicles />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/requests" element={<ServiceRequests />} />
                    <Route path="ledger" element={<Ledger />} />
                    <Route path="ledger/customer/:id" element={<CustomerLedger />} />
                    <Route path="receipts" element={<Receipts />} />
                    <Route path="receipts/:id" element={<ViewReceipt />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="users" element={<Users />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
