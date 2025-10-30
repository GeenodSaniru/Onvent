import React, { useState } from 'react';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  // Password requirements
  const passwordRequirements = [
    { regex: /.{8,}/, message: 'At least 8 characters long' },
    { regex: /[A-Z]/, message: 'At least one uppercase letter' },
    { regex: /[a-z]/, message: 'At least one lowercase letter' },
    { regex: /[0-9]/, message: 'At least one digit' },
    { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
  ];

  const validatePassword = (password) => {
    const errors = [];
    passwordRequirements.forEach(requirement => {
      if (!requirement.regex.test(password)) {
        errors.push(requirement.message);
      }
    });
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });

    // Validate password in real-time
    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    // Validate password before submission
    const errors = validatePassword(user.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setError('Password does not meet requirements');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await userService.registerUser(user);
      setMessage('User registered successfully! Redirecting to login...');
      setUser({ name: '', username: '', email: '', password: '' });
      setPasswordErrors([]);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error registering user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>User Registration</h2>
      {message && (
        <div className="message">
          {message}
        </div>
      )}
      {error && error !== 'Password does not meet requirements' && (
        <div className="error">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
          />
          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              {passwordRequirements.map((req, index) => (
                <li 
                  key={index} 
                  className={passwordErrors.includes(req.message) ? 'requirement-missing' : 'requirement-met'}
                >
                  {req.message}
                </li>
              ))}
            </ul>
          </div>
          {passwordErrors.length > 0 && (
            <div className="password-errors">
              <h4>Missing Requirements:</h4>
              <ul>
                {passwordErrors.map((error, index) => (
                  <li key={index} className="error">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <style jsx>{`
        .password-requirements {
          margin-top: 0.5rem;
          padding: 1rem;
          background-color: var(--surface-light);
          border-radius: var(--border-radius);
        }
        
        .password-requirements h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .password-requirements ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .requirement-met {
          color: var(--success-color);
        }
        
        .requirement-missing {
          color: var(--error-color);
        }
        
        .password-errors {
          margin-top: 1rem;
          padding: 1rem;
          background-color: rgba(248, 113, 113, 0.15);
          border-radius: var(--border-radius);
          border: 1px solid var(--error-color);
        }
        
        .password-errors h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: var(--error-color);
        }
        
        .password-errors ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .password-errors li {
          color: var(--error-color);
        }
      `}</style>
    </div>
  );
};

export default UserRegistration;