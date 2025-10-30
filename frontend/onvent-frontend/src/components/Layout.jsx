import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Function to check auth status
  const checkAuthStatus = async () => {
    try {
      // First check localStorage for quick initial state
      const storedLoggedIn = localStorage.getItem('isLoggedIn');
      const storedRole = localStorage.getItem('userRole');
      
      if (storedLoggedIn === 'true') {
        setIsLoggedIn(true);
        setUserRole(storedRole);
      }
      
      // Then verify with backend
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

  // Check if user is logged in by verifying with backend
  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic check every 5 minutes
    const interval = setInterval(checkAuthStatus, 300000);
    
    // Listen for auth state changes
    const handleAuthStateChange = (event) => {
      const { isLoggedIn: newIsLoggedIn, userRole: newUserRole } = event.detail;
      setIsLoggedIn(newIsLoggedIn);
      setUserRole(newUserRole);
    };
    
    window.addEventListener('authStateChange', handleAuthStateChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('authStateChange', handleAuthStateChange);
    };
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
      
      // Create a custom event to notify other components of logout
      window.dispatchEvent(new CustomEvent('authStateChange', { 
        detail: { isLoggedIn: false, userRole: null } 
      }));
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserRole(null);
      setShowProfileDropdown(false);
      
      // Create a custom event to notify other components of logout
      window.dispatchEvent(new CustomEvent('authStateChange', { 
        detail: { isLoggedIn: false, userRole: null } 
      }));
      
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
                    <Link to="/user/profile">
                      My Profile
                    </Link>
                  </li>
                  <li><button onClick={handleLogout}>Logout</button></li>
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