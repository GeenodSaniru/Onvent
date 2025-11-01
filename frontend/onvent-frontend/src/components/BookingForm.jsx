import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const BookingForm = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [bookingData, setBookingData] = useState({
    quantity: 1
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/api/events/${eventId}`)
      setEvent(response.data)
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: parseInt(e.target.value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const userId = localStorage.getItem('userId')
      const bookingRequest = {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
        quantity: bookingData.quantity
      }
      
      const response = await api.post('/api/bookings', bookingRequest)
      
      if (response.data) {
        setSuccess('Booking successful! You will receive a confirmation email shortly.')
        // Redirect to user dashboard after 2 seconds
        setTimeout(() => {
          navigate('/user/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book tickets')
    } finally {
      setSubmitting(false)
    }
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
    <div className="booking-form">
      <h1>Book Tickets</h1>
      <div className="booking-event-info">
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ${event.price} per ticket</p>
        <p><strong>Seats Available:</strong> {event.seats}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Number of Tickets</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={event.seats}
            value={bookingData.quantity}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <p><strong>Total Price:</strong> ${bookingData.quantity * event.price}</p>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting || event.seats <= 0}>
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookingForm