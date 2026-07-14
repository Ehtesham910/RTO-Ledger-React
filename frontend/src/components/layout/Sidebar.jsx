import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/sidebar.css';

function Sidebar({ isCollapsed }) {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (!location.pathname.startsWith('/services')) {
            setIsServicesOpen(false);
        }
    }, [location.pathname]);

    // Get user from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = user.role || 'user';

    // Helper to check active path
    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/') return true;
        if (location.pathname === path) return true;
        if (path !== '/' && path !== '/dashboard' && location.pathname.startsWith(path + '/')) return true;
        return false;
    };

    const matchQuery = (label) => {
        if (!searchQuery) return true;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    return (
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

            <ul className='sidebar-menu' style={{ paddingTop: '0' }}>

                {/* Dashboard */}
                {matchQuery('Dashboard') && (
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
                )}

                {/* Customer */}
                {matchQuery('Customers') && (
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
                )}

                {/* Vehicles */}
                {matchQuery('Vehicles') && (
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
                )}

                {/* Services Dropdown */}
                {matchQuery('Services') && (
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
                        <ul className="submenu" style={{ display: (isServicesOpen || searchQuery) ? 'flex' : 'none' }}>
                            {matchQuery('Service List') && (
                                <li>
                                    <Link to="/services" className={location.pathname === '/services' ? 'active-submenu' : ''}>
                                        <span className="submenu-dot"></span>
                                        Service List
                                    </Link>
                                </li>
                            )}
                            {matchQuery('Service Requests') && (
                                <li>
                                    <Link to="/services/requests" className={location.pathname === '/services/requests' ? 'active-submenu' : ''}>
                                        <span className="submenu-dot"></span>
                                        Service Requests
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </li>
                )}

                {/* Ledger & Receipts: Hidden for Operator and Agent */}
                {role !== 'Operator' && role !== 'Agent' && (
                    <>
                        {matchQuery('Ledger') && (
                            <li className={`menu-item ${isActive('/ledger') ? 'active' : ''}`}>
                                <Link to="/ledger">
                                    <span className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                    </span>
                                    <span className="menu-label">Ledger</span>
                                </Link>
                            </li>
                        )}

                        {matchQuery('Receipts') && (
                            <li className={`menu-item ${isActive('/receipts') ? 'active' : ''}`}>
                                <Link to="/receipts">
                                    <span className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 3v18l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V3z" />
                                            <path d="M7 9h10" />
                                            <path d="M7 13h10" />
                                            <path d="M7 17h6" />
                                        </svg>
                                    </span>
                                    <span className="menu-label">Receipts</span>
                                </Link>
                            </li>
                        )}
                    </>
                )}
                
                {/* System Management: Only for Admin */}
                {role === 'Admin' && (
                    <>
                        <hr className="sidebar-divider" />
                        
                        {matchQuery('Roles & Permissions') && (
                            <li className={`menu-item ${isActive('/roles') ? 'active' : ''}`}>
                                <Link to="/roles">
                                    <span className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </span>
                                    <span className="menu-label">Roles & Permissions</span>
                                </Link>
                            </li>
                        )}

                        {matchQuery('Users & Permissions') && (
                            <li className={`menu-item ${isActive('/users') ? 'active' : ''}`}>
                                <Link to="/users">
                                    <span className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                            <path d="M18 14l2 2 4-4" strokeWidth="2" />
                                        </svg>
                                    </span>
                                    <span className="menu-label">Users & Permissions</span>
                                </Link>
                            </li>
                        )}
                    </>
                )}
            </ul>
        </aside >
    );
}

export default Sidebar;
