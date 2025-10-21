import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
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
                <th>Organizer ID</th>
                {isLoggedIn && <th>Actions</th>}
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
                  <td>{event.organizer?.id || 'N/A'}</td>
                  {isLoggedIn && (
                    <td>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="btn-secondary"
                      >
                        Delete
                      </button>
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