import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/sidebar.css';

function PortalSidebar({ isCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo-container">
                    {!isCollapsed && <span className="sidebar-logo"><h3>RTO Ledger</h3></span>}
                </div>
                <ul className="sidebar-menu">
                    <li className={`menu-item ${isActive('/portal/dashboard') ? 'active' : ''}`}>
                        <NavLink to="/portal/dashboard">
                            <span className="menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </span>
                            <span className="menu-label">Dashboard</span>
                        </NavLink>
                    </li>

                    <li className={`menu-item ${isActive('/portal/vehicles') ? 'active' : ''}`}>
                        <NavLink to="/portal/vehicles">
                            <span className="menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </span>
                            <span className="menu-label">My Vehicles</span>
                        </NavLink>
                    </li>

                    <li className={`menu-item ${isActive('/portal/service-requests') ? 'active' : ''}`}>
                        <NavLink to="/portal/service-requests">
                            <span className="menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                            <span className="menu-label">My Requests</span>
                        </NavLink>
                    </li>

                    <li className={`menu-item ${isActive('/portal/ledger') ? 'active' : ''}`}>
                        <NavLink to="/portal/ledger">
                            <span className="menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            </span>
                            <span className="menu-label">My Ledger</span>
                        </NavLink>
                    </li>

                    <li className={`menu-item ${isActive('/portal/receipts') ? 'active' : ''}`}>
                        <NavLink to="/portal/receipts">
                            <span className="menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                            <span className="menu-label">My Receipts</span>
                        </NavLink>
                    </li>

                </ul>
            </aside>
        </>
    );
}

export default PortalSidebar;
