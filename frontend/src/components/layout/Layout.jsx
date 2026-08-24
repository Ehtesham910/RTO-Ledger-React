import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => {
        // Toggle mobile drawer on mobile screens, desktop collapse on desktop screens
        if (window.innerWidth <= 768) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            {isMobileOpen && (
                <div 
                    className="sidebar-mobile-backdrop"
                    onClick={closeMobileSidebar}
                />
            )}
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                isMobileOpen={isMobileOpen}
                closeMobile={closeMobileSidebar}
                onExpand={() => setIsSidebarCollapsed(false)} 
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />
                <main style={{ flex: 1 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default Layout;