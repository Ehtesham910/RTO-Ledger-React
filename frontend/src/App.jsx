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
import Search from './pages/Search';

// Portal Imports
import PortalLayout from './components/layout/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import MyVehicles from './pages/portal/MyVehicles';
import MyServiceRequests from './pages/portal/MyServiceRequests';
import MyLedger from './pages/portal/MyLedger';
import MyReceipts from './pages/portal/MyReceipts';
import PortalSearch from './pages/portal/PortalSearch';

// Setup global axios interceptor
axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
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
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/';
    } else if (error.response && error.response.status === 403) {
        // Automatically reload to fetch fresh permissions if backend rejects access
        if (!sessionStorage.getItem('reloading')) {
            sessionStorage.setItem('reloading', 'true');
            alert("Your access permissions have been updated. The page will now refresh.");
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloading');
        }
    }
    return Promise.reject(error);
});

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles, allowedPermissions }) => {
    const token = sessionStorage.getItem('token');
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = user.role;
    const permissions = user.permissions || [];

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedPermissions && allowedPermissions.length > 0) {
        const hasPerm = allowedPermissions.some(perm => permissions.includes(perm));
        if (!hasPerm) {
            return <Navigate to="/dashboard" replace />;
        }
    } else if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'Customer') {
            return <Navigate to="/portal/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    const [authLoading, setAuthLoading] = React.useState(!!sessionStorage.getItem('token'));

    React.useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`)
                .then(res => {
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error("Failed to refresh user:", err);
                    if (err.response && err.response.status === 401) {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                    }
                })
                .finally(() => {
                    setAuthLoading(false);
                });
        }
    }, []);

    if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#64748b' }}>Loading...</div>;

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
                    
                    {/* Protected by Permissions */}
                    <Route path="/ledger" element={<ProtectedRoute allowedPermissions={['ledger.view']}><Ledger /></ProtectedRoute>} />
                    <Route path="/ledger/customer/:id" element={<ProtectedRoute allowedPermissions={['ledger.view']}><CustomerLedger /></ProtectedRoute>} />
                    <Route path="/receipts" element={<ProtectedRoute allowedPermissions={['receipt.view']}><Receipts /></ProtectedRoute>} />
                    <Route path="/receipts/:id" element={<ProtectedRoute allowedPermissions={['receipt.view']}><ViewReceipt /></ProtectedRoute>} />
                    
                    {/* System Management */}
                    <Route path="/roles" element={<ProtectedRoute allowedPermissions={['role.manage']}><Roles /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute allowedPermissions={['user.manage']}><Users /></ProtectedRoute>} />

                    {/* Global Search */}
                    <Route path="/search" element={<Search />} />
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
                    <Route path="search" element={<PortalSearch />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
