import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar isCollapsed={isSidebarCollapsed} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />
                <main style={{ padding: '24px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default Layout;