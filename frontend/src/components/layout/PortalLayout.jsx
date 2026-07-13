import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import PortalSidebar from './PortalSidebar';

function PortalLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const token = sessionStorage.getItem('token');

    // Make sure only Customer role can access the portal layout
    if (!token || user.role !== 'Customer') {
        return <Navigate to="/" replace />;
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <PortalSidebar isCollapsed={isSidebarCollapsed} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PortalLayout;
