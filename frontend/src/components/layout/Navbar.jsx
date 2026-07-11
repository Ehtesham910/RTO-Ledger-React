import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/navbar.css'; 
import EditProfileModal from '../modals/EditProfileModal';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
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
        <form className="navbar-search" onSubmit={(e) => {
          e.preventDefault();
          const query = e.target.searchQuery.value;
          if (!query.trim()) return;

          if (user && user.role === 'Customer') {
            navigate(`/portal/search?q=${encodeURIComponent(query.trim())}`);
          } else {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          }
        }}>
          <input 
            type="text" 
            name="searchQuery"
            placeholder="Search vehicles, customers..." 
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="navbar-right">
        
        <div className="user-menu" ref={dropdownRef}>
          <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">{initial}</div>
            <span className="user-greet">{displayName}</span>
          </div>
          
          {dropdownOpen && (
            <div className="user-dropdown" style={{ display: 'block', position: 'absolute', top: '50px', right: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', minWidth: '120px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); setIsProfileModalOpen(true); }} style={{ display: 'block', padding: '8px', color: '#334155', textDecoration: 'none' }}>Edit Profile</a>
              <a href="#" onClick={handleLogout} style={{ display: 'block', padding: '8px', color: '#ef4444', textDecoration: 'none' }}>Logout</a>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSuccess={(updatedUser) => {
            setIsProfileModalOpen(false);
            // Re-merge with existing user object to keep token etc.
            const newUser = { ...user, ...updatedUser };
            // Ensure username matches name for customer if name changed
            if (newUser.role === 'Customer' && updatedUser.name) {
                newUser.username = updatedUser.name;
            }
            setUser(newUser);
            sessionStorage.setItem('user', JSON.stringify(newUser));
        }}
      />

    </nav>
  );
}

export default Navbar;
