import React from 'react';
import { Link } from 'react-router-dom';

const UserHome = () => {
  return (
    <div className="user-home">
      {/* Navigation Links Section */}
      <div className="dashboard-navigation">
        <h2>Quick Navigation</h2>
        <div className="nav-links-container">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home Page</span>
          </Link>
          <Link to="/events" className="nav-link">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Event List</span>
          </Link>
          <Link to="/tickets" className="nav-link">
            <span className="nav-icon">🎟️</span>
            <span className="nav-text">My Tickets</span>
          </Link>
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">📋</span>
            <span className="nav-text">My Bookings</span>
          </Link>
        </div>
      </div>

      <h1>User Home</h1>
      <p>Welcome to your personal dashboard!</p>
      <div className="user-features">
        <div className="feature-card">
          <h3>My Bookings</h3>
          <p>View and manage your event bookings</p>
        </div>
        <div className="feature-card">
          <h3>Browse Events</h3>
          <p>Discover and book tickets for upcoming events</p>
        </div>
        <div className="feature-card">
          <h3>Profile Settings</h3>
          <p>Update your personal information</p>
        </div>
      </div>

      <style jsx>{`
        .user-home {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .user-home h1 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .user-features {
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
          .user-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHome;