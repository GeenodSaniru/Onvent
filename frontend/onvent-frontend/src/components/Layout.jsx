import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in by verifying with backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/api/auth/me');
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUserRole(response.data.role);
          localStorage.setItem('userRole', response.data.role);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        // Only set as logged out if we get a 401 or 403, otherwise keep current state
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('userRole');
        }
        // For network errors or other issues, we don't change the auth state
      }
    };

    checkAuthStatus();
    
    // Set up periodic check every 5 minutes
    const interval = setInterval(checkAuthStatus, 300000);
    
    return () => clearInterval(interval);
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

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      // Clear auth state
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserRole(null);
      setShowProfileDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserRole(null);
      setShowProfileDropdown(false);
      navigate('/login');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Onvent</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/events">Events</Link></li>
          
          {!isLoggedIn ? (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : (
            <>
              {userRole === 'ADMIN' ? (
                <>
                  <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                  <li><Link to="/events/create">Create Event</Link></li>
                  <li><Link to="/user-management">Manage Users</Link></li>
                </>
              ) : (
                <li><Link to="/user/home">My Dashboard</Link></li>
              )}
              <li className="profile-dropdown" ref={dropdownRef}>
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  Profile ▼
                </button>
                {showProfileDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to={userRole === 'ADMIN' ? "/admin/dashboard" : "/user/home"}>
                        My Profile
                      </Link>
                    </li>
                    <li><button onClick={handleLogout}>Sign Out</button></li>
                  </ul>
                )}
              </li>
            </>
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