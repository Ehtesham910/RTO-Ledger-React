import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/navbar.css'; 

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const displayName = user && user.username ? user.username : 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      
      {/* LEFT LOGO */}
      <div className="navbar-left">
        <div className="navbar-logo">RTO Ledger</div>
      </div>

      {/* CENTER SEARCH */}
      <div className="navbar-center">
        <div className="navbar-search">
          <input type="text" placeholder="Search vehicles, customers..." />
          <button>Search</button>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="navbar-right">
        
        <div className="user-menu" onMouseLeave={() => setDropdownOpen(false)}>
          <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">{initial}</div>
            <span className="user-greet">{displayName}</span>
          </div>
          
          {dropdownOpen && (
            <div className="user-dropdown" style={{ display: 'block', position: 'absolute', top: '50px', right: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', minWidth: '120px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <a href="/profile" style={{ display: 'block', padding: '8px', color: '#334155', textDecoration: 'none' }}>Profile</a>
              <a href="/" onClick={handleLogout} style={{ display: 'block', padding: '8px', color: '#ef4444', textDecoration: 'none' }}>Logout</a>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
