import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch events
      const eventsResponse = await api.get('/api/events')
      setEvents(eventsResponse.data)
      
      // Fetch all bookings
      const bookingsResponse = await api.get('/api/bookings/admin')
      setBookings(bookingsResponse.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await api.delete(`/api/events/${eventId}`)
      // Refresh events
      fetchDashboardData()
    } catch (err) {
      setError('Failed to delete event')
    }
  }

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p>{events.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{bookings.length}</p>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Manage Events</h2>
            <Link to="/events/create" className="btn btn-primary">Create Event</Link>
          </div>
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> ${event.price}</p>
                <p><strong>Seats:</strong> {event.seats}</p>
                <div className="card-actions">
                  <Link to={`/events/${event.id}/edit`} className="btn btn-secondary">Edit</Link>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>All Bookings</h2>
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <h3>{booking.eventTitle}</h3>
                <p><strong>User:</strong> {booking.userName}</p>
                <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard