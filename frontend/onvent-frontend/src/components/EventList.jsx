import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and get user role
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(loggedIn);
    setUserRole(role);
    
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      setEvents(response.data);
      setError('');
    } catch (err) {
      setError('Error loading events: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        loadEvents(); // Refresh the list
      } catch (err) {
        setError('Error deleting event: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleBookEvent = async (eventId) => {
    try {
      // Redirect to booking page with event ID
      navigate(`/tickets/book/${eventId}`);
    } catch (err) {
      setError('Error booking event: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="message">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-list">
      <h2>Events</h2>
      <div className="form-actions">
        <button onClick={loadEvents}>Refresh Events</button>
      </div>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Location</th>
                <th>Date</th>
                <th>Price</th>
                <th>Max Attendees</th>
                <th>Organizer</th>
                {(isLoggedIn || userRole === 'ADMIN') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.description.substring(0, 50)}...</td>
                  <td>{event.location}</td>
                  <td>{new Date(event.eventDate).toLocaleString()}</td>
                  <td>${event.price.toFixed(2)}</td>
                  <td>{event.maxAttendees}</td>
                  <td>{event.organizer?.username || 'N/A'}</td>
                  {(isLoggedIn || userRole === 'ADMIN') && (
                    <td>
                      <button 
                        onClick={() => handleBookEvent(event.id)}
                        className="btn-primary"
                      >
                        Book
                      </button>
                      {userRole === 'ADMIN' && (
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="btn-secondary"
                          style={{ marginLeft: '10px' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventList;