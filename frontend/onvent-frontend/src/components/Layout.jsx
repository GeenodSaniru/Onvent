import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in (this would typically come from context or localStorage)
  useEffect(() => {
    // In a real app, this would check actual auth state
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Onvent</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/dashboard">My Bookings</Link></li>
          
          {!isLoggedIn ? (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : (
            <li className="profile-dropdown" ref={dropdownRef}>
              <button 
                className="profile-button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                Profile ▼
              </button>
              {showProfileDropdown && (
                <ul className="dropdown-menu">
                  <li><Link to="/dashboard">My Profile</Link></li>
                  <li><button onClick={handleLogout}>Sign Out</button></li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;