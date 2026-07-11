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

// Portal Imports
import PortalLayout from './components/layout/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import MyVehicles from './pages/portal/MyVehicles';
import MyServiceRequests from './pages/portal/MyServiceRequests';
import MyLedger from './pages/portal/MyLedger';
import MyReceipts from './pages/portal/MyReceipts';

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
        window.location.href = '/';
    }
    return Promise.reject(error);
});

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'Customer') {
            return <Navigate to="/portal/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    {/* Accessible to All Protected Roles */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/requests" element={<ServiceRequests />} />
                    
                    {/* Accessible to Admin, Accountant, Viewer */}
                    <Route path="/ledger" element={<ProtectedRoute allowedRoles={['Admin', 'Accountant', 'Viewer']}><Ledger /></ProtectedRoute>} />
                    <Route path="/ledger/customer/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Accountant', 'Viewer']}><CustomerLedger /></ProtectedRoute>} />
                    <Route path="/receipts" element={<ProtectedRoute allowedRoles={['Admin', 'Accountant', 'Viewer']}><Receipts /></ProtectedRoute>} />
                    <Route path="/receipts/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Accountant', 'Viewer']}><ViewReceipt /></ProtectedRoute>} />
                    
                    {/* Accessible to Admin Only */}
                    <Route path="/roles" element={<ProtectedRoute allowedRoles={['Admin']}><Roles /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']}><Users /></ProtectedRoute>} />
                </Route>

                {/* Customer Portal Routes */}
                <Route path="/portal" element={<ProtectedRoute allowedRoles={['Customer']}><PortalLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/portal/dashboard" replace />} />
                    <Route path="dashboard" element={<PortalDashboard />} />
                    <Route path="vehicles" element={<MyVehicles />} />
                    <Route path="service-requests" element={<MyServiceRequests />} />
                    <Route path="ledger" element={<MyLedger />} />
                    <Route path="receipts" element={<MyReceipts />} />
                    <Route path="receipts/:id" element={<ViewReceipt />} />
                    {/* ViewReceipt works for both because it just relies on state.receipt or API fetch */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
