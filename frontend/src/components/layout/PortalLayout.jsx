import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import PortalSidebar from './PortalSidebar';

function PortalLayout() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const token = sessionStorage.getItem('token');

    // Make sure only Customer role can access the portal layout
    if (!token || user.role !== 'Customer') {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <PortalSidebar />
            <main style={{ marginLeft: '205px', marginTop: '60px', padding: '8px 24px 24px 24px' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default PortalLayout;
