import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        if (response.status === 200) {
          setUser({
            name: response.data.name,
            username: response.data.username,
            email: response.data.email
          });
          setLoading(false);
        } else {
          throw new Error('Failed to load user profile');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load user profile');
        setLoading(false);
        // If unauthorized, redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('userRole');
          window.dispatchEvent(new CustomEvent('authStateChange', { 
            detail: { isLoggedIn: false, userRole: null } 
          }));
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(user);
      if (response.status === 200) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    
    // Check if new password is provided
    if (!passwordData.newPassword) {
      setError('New password is required');
      return;
    }
    
    try {
      const response = await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.status === 200) {
        setMessage('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update password');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update password');
    }
  };

  if (loading) {
    return <div className="user-profile">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
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
      
      <div className="profile-section">
        <h3>Personal Information</h3>
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-field">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="profile-field">
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="profile-edit">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleProfileChange}
                required
                disabled
              />
              <small>Username cannot be changed</small>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
      
      <div className="password-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
      
      <style jsx>{`
        .user-profile {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .profile-section, .password-section {
          background-color: var(--surface-light);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--box-shadow);
        }
        
        .profile-field {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .profile-field label {
          font-weight: var(--font-weight-semibold);
          width: 150px;
        }
        
        .profile-view button {
          margin-top: 1rem;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .password-form button {
          margin-top: 1rem;
        }
        
        small {
          color: var(--text-secondary-light);
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  );
};

export default UserProfile;