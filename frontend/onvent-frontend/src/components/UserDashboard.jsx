import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import '../App.css';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      // In the new implementation, we don't need to pass userId since it's inferred from the session
      await ticketService.cancelBooking(ticketId);
      setSuccess('Booking cancelled successfully!');
      // Refresh bookings
      fetchMyBookings();
    } catch (err) {
      setError('Failed to cancel booking: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Bookings Dashboard</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any active bookings yet.</p>
          <a href="/events" className="btn-link">Browse Events</a>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.ticketId} className="booking-card">
              <div className="booking-header">
                <h3>{booking.eventTitle}</h3>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <strong>Ticket Code:</strong>
                  <span className="ticket-code">{booking.ticketCode}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Event Date:</strong>
                  <span>{formatDate(booking.eventDate)}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Location:</strong>
                  <span>{booking.eventLocation}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Price:</strong>
                  <span className="price">${booking.eventPrice.toFixed(2)}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Purchase Date:</strong>
                  <span>{formatDate(booking.purchaseDate)}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Available Seats:</strong>
                  <span>{booking.availableSeats}</span>
                </div>
              </div>
              
              {booking.status === 'ACTIVE' && (
                <div className="booking-actions">
                  <button
                    onClick={() => handleCancelBooking(booking.ticketId)}
                    className="cancel-btn"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #c3e6cb;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }

        .no-bookings {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .no-bookings p {
          font-size: 18px;
          color: #666;
          margin-bottom: 20px;
        }

        .btn-link {
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .btn-link:hover {
          background-color: #0056b3;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .booking-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .booking-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .booking-header h3 {
          margin: 0;
          color: #333;
          font-size: 20px;
          flex: 1;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .status-badge.active {
          background-color: #28a745;
          color: white;
        }

        .status-badge.cancelled {
          background-color: #dc3545;
          color: white;
        }

        .booking-details {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row strong {
          color: #555;
          font-size: 14px;
        }

        .detail-row span {
          color: #333;
          font-size: 14px;
        }

        .ticket-code {
          font-family: monospace;
          background-color: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
        }

        .price {
          color: #28a745;
          font-weight: bold;
          font-size: 16px;
        }

        .booking-actions {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid #f0f0f0;
        }

        .cancel-btn {
          width: 100%;
          padding: 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .cancel-btn:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;