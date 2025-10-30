import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        if (storedLoggedIn !== 'true') {
          navigate('/login');
          return;
        }

        // Then verify with backend
        const response = await api.get('/api/auth/me');
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('userRole');
          navigate('/login');
        }
      } catch (error) {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userRole');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;