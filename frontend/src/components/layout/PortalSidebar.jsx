import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/sidebar.css';

function PortalSidebar({ isCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const matchQuery = (label) => {
        if (!searchQuery) return true;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo-container" style={{ borderBottom: 'none', height: 'auto', padding: '24px 16px 16px 16px' }}>
                    {!isCollapsed ? (
                        <span className="sidebar-logo" style={{ fontSize: '32px', display: 'flex', alignItems: 'center', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                            <span style={{ color: '#00c292', fontWeight: '900' }}>RTO</span> 
                            <span style={{ color: '#0f172a', fontWeight: '900', marginLeft: '6px' }}>LEDGER</span>
                        </span>
                    ) : (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                backgroundColor: '#0f172a', 
                                borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <span style={{ color: '#00c292', fontWeight: '900', fontSize: '24px', fontFamily: "'Inter', sans-serif" }}>R</span> 
                            </div>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="sidebar-search-container" style={{ padding: '0 16px 16px 16px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <svg style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search menu..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '8px 8px 8px 32px', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '6px', 
                                    fontSize: '13px', 
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00c292'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>
                )}

                <ul className="sidebar-menu" style={{ paddingTop: '0' }}>
                    {matchQuery('Dashboard') && (
                        <li className={`menu-item ${isActive('/portal/dashboard') ? 'active' : ''}`}>
                            <NavLink to="/portal/dashboard">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </span>
                                <span className="menu-label">Dashboard</span>
                            </NavLink>
                        </li>
                    )}

                    {matchQuery('My Vehicles') && (
                        <li className={`menu-item ${isActive('/portal/vehicles') ? 'active' : ''}`}>
                            <NavLink to="/portal/vehicles">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </span>
                                <span className="menu-label">My Vehicles</span>
                            </NavLink>
                        </li>
                    )}

                    {matchQuery('My Requests') && (
                        <li className={`menu-item ${isActive('/portal/service-requests') ? 'active' : ''}`}>
                            <NavLink to="/portal/service-requests">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </span>
                                <span className="menu-label">My Requests</span>
                            </NavLink>
                        </li>
                    )}

                    {matchQuery('My Ledger') && (
                        <li className={`menu-item ${isActive('/portal/ledger') ? 'active' : ''}`}>
                            <NavLink to="/portal/ledger">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </span>
                                <span className="menu-label">My Ledger</span>
                            </NavLink>
                        </li>
                    )}

                    {matchQuery('My Receipts') && (
                        <li className={`menu-item ${isActive('/portal/receipts') ? 'active' : ''}`}>
                            <NavLink to="/portal/receipts">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </span>
                                <span className="menu-label">My Receipts</span>
                            </NavLink>
                        </li>
                    )}

                </ul>
            </aside>
        </>
    );
}

export default PortalSidebar;
