import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Navigation Links Section */}
      <div className="dashboard-navigation">
        <h2>Admin Quick Navigation</h2>
        <div className="nav-links-container">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home Page</span>
          </Link>
          <Link to="/events" className="nav-link">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Event List</span>
          </Link>
          <Link to="/events/create" className="nav-link">
            <span className="nav-icon">➕</span>
            <span className="nav-text">Create Event</span>
          </Link>
          <Link to="/user-management" className="nav-link">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Manage Users</span>
          </Link>
        </div>
      </div>

      <h1>Admin Dashboard</h1>
      <p>Welcome, Administrator!</p>
      <div className="admin-features">
        <div className="feature-card">
          <h3>Event Management</h3>
          <p>Create, update, and delete events</p>
        </div>
        <div className="feature-card">
          <h3>User Management</h3>
          <p>View and manage all users</p>
        </div>
        <div className="feature-card">
          <h3>Booking Reports</h3>
          <p>View all bookings and generate reports</p>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .admin-dashboard h1 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .feature-card h3 {
          margin-top: 0;
          color: #333;
        }

        .feature-card p {
          color: #666;
        }

        @media (max-width: 768px) {
          .admin-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;