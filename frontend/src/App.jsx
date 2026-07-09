import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
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
