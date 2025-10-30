import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import ticketService from '../services/ticketService';

const EventBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(eventId);
      setEvent(response.data);
      setError('');
    } catch (err) {
      setError('Error loading event details: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please enter your user ID');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingData = {
        purchaseDate: new Date().toISOString(),
        user: { id: parseInt(userId) },
        event: { id: parseInt(eventId) }
      };

      const response = await ticketService.bookTicket(bookingData);
      setSuccess('Ticket booked successfully!');
      
      // Optionally redirect to user dashboard or ticket view
      setTimeout(() => {
        navigate('/user/home');
      }, 2000);
    } catch (err) {
      setError('Error booking ticket: ' + (err.response?.data?.message || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="message">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ticket-form">
      <h2>Book Event: {event?.title}</h2>
      
      {event && (
        <div className="event-details">
          <h3>Event Details:</h3>
          <div className="table-container">
            <table className="events-table">
              <tbody>
                <tr>
                  <td><strong>Title:</strong></td>
                  <td>{event.title}</td>
                </tr>
                <tr>
                  <td><strong>Description:</strong></td>
                  <td>{event.description}</td>
                </tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>{event.location}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>{new Date(event.eventDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Price:</strong></td>
                  <td>${event.price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Max Attendees:</strong></td>
                  <td>{event.maxAttendees}</td>
                </tr>
                <tr>
                  <td><strong>Organizer:</strong></td>
                  <td>{event.organizer?.username || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="booking-form">
        <h3>Book Your Ticket</h3>
        {success && <div className="message">{success}</div>}
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label htmlFor="userId">Your User ID:</label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
            />
          </div>
          
          <button type="submit" disabled={bookingLoading}>
            {bookingLoading ? 'Booking...' : 'Book Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventBooking;