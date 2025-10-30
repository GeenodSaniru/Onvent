import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/all');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const assignAdminRole = async (userId) => {
    try {
      await api.put(`/users/${userId}/assign-admin`);
      setMessage('Admin role assigned successfully');
      fetchUsers(); // Refresh the user list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to assign admin role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeAdminRole = async (userId) => {
    try {
      await api.put(`/users/${userId}/remove-admin`);
      setMessage('Admin role removed successfully');
      fetchUsers(); // Refresh the user list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to remove admin role');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
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
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>
                {user.role === 'USER' ? (
                  <button 
                    onClick={() => assignAdminRole(user.id)}
                    className="btn-admin"
                  >
                    Make Admin
                  </button>
                ) : (
                  <button 
                    onClick={() => removeAdminRole(user.id)}
                    className="btn-user"
                  >
                    Remove Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;