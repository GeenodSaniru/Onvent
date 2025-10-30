import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserLogin = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.status === 200) {
        // Set authentication state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', response.data.role);
        setMessage('Login successful! Redirecting...');
        
        // Redirect based on user role
        setTimeout(() => {
          if (response.data.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/home');
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      // Ensure we're marked as logged out on login failure
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userRole');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>User Login</h2>
      {message && (
        <div className="message">
          {message}
        </div>
      )}
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Email or Username:</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            required
            placeholder="Enter your email or username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;