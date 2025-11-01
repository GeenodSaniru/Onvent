import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/api/events/${id}`)
      setEvent(response.data)
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleBookTicket = () => {
    const isLoggedIn = localStorage.getItem('authToken')
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    navigate(`/book/${id}`)
  }

  if (loading) {
    return <div className="loading-container">Loading event details...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!event) {
    return <div className="error-message">Event not found</div>
  }

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <div className="event-content">
        <div className="event-info">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Price:</strong> ${event.price}</p>
          <p><strong>Seats Available:</strong> {event.seats}</p>
        </div>
        <div className="event-actions">
          <button onClick={handleBookTicket} className="btn btn-primary" disabled={event.seats <= 0}>
            {event.seats <= 0 ? 'Sold Out' : 'Book Ticket'}
          </button>
          <Link to="/events" className="btn btn-secondary">Back to Events</Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetails