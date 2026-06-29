import React from 'react';
import '../../assets/css/navbar.css'; // Aapki move ki hui CSS yaha link ho gayi

function Navbar() {
  return (
    // Har class ko className me badal diya gaya hai
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
        
        <div className="user-menu">
          <div className="user-trigger">
            <div className="user-avatar">A</div>
            <span className="user-greet">Admin</span>
          </div>
          
          {/* Dropdown (Abhi hidden hai, CSS se 'show' class lagane par dikhega) */}
          <div className="user-dropdown">
            <a href="/profile">Profile</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
