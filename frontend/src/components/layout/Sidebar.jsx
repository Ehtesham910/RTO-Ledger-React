import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/sidebar.css';

function Sidebar() {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const location = useLocation();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';

    // Helper to check active path
    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/') return true;
        if (location.pathname === path) return true;
        if (path !== '/' && path !== '/dashboard' && location.pathname.startsWith(path + '/')) return true;
        return false;
    };

    return (
        <aside className='sidebar'>
            <ul className='sidebar-menu'>

                {/* Dashboard */}
                <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <Link to="/dashboard">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </span>
                        <span className="menu-label">Dashboard</span>
                    </Link>
                </li>

                {/* Customer */}
                <li className={`menu-item ${isActive('/customers') ? 'active' : ''}`}>
                    <Link to="/customers">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </span>
                        <span className="menu-label">Customers</span>
                    </Link>
                </li>

                {/* Vehicles */}
                <li className={`menu-item ${isActive('/vehicles') ? 'active' : ''}`}>
                    <Link to="/vehicles">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
                                <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                            </svg>
                        </span>
                        <span className="menu-label">Vehicles</span>
                    </Link>
                </li>

                {/* Services Dropdown */}
                <li className={`menu-item service-menu ${isActive('/services') || isServicesOpen ? 'open' : ''} ${isActive('/services') ? 'active' : ''}`}>
                    <a className="menu-toggle" onClick={() => setIsServicesOpen(!isServicesOpen)} style={{ cursor: 'pointer' }}>
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                            </svg>
                        </span>
                        <span className="menu-label">Services</span>
                        <span className="chevron">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </a>
                    {/* Submenu List */}
                    <ul className="submenu">
                        <li>
                            <Link to="/services" className={location.pathname === '/services' ? 'active-submenu' : ''}>
                                <span className="submenu-dot"></span>
                                Service List
                            </Link>
                        </li>
                        <li>
                            <Link to="/services/requests" className={location.pathname === '/services/requests' ? 'active-submenu' : ''}>
                                <span className="submenu-dot"></span>
                                Service Requests
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* Ledger & Receipts: Hidden for Operator and Agent */}
                {role !== 'Operator' && role !== 'Agent' && (
                    <>
                        <li className={`menu-item ${isActive('/ledger') ? 'active' : ''}`}>
                            <Link to="/ledger">
                                <span className="menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                </span>
                                <span className="menu-label">Ledger</span>
                            </Link>
                        </li>

                {/* Receipts Menu Item */}
                <li className={`menu-item ${isActive('/receipts') ? 'active' : ''}`}>
                    <Link to="/receipts">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </span>
                        <span className="menu-label">Receipts</span>
                            </Link>
                        </li>
                    </>
                )}
                
                {/* System Management: Only for Admin */}
                {role === 'Admin' && (
                    <>
                        <hr className="sidebar-divider" />
                        
                        {/* Roles & Permissions Menu Item */}
                        <li className={`menu-item ${isActive('/roles') ? 'active' : ''}`}>
                    <Link to="/roles">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </span>
                        <span className="menu-label">Roles & Permissions</span>
                    </Link>
                </li>
                {/* Users & Permissions Menu Item */}
                <li className={`menu-item ${isActive('/users') ? 'active' : ''}`}>
                    <Link to="/users">
                        <span className="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                <path d="M18 14l2 2 4-4" stroke-width="2" />
                            </svg>
                        </span>
                            <span className="menu-label">Users & Permissions</span>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </aside >
    );
}

export default Sidebar;