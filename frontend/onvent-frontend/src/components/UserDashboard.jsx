import React, { useState, useEffect } from 'react'
import api from '../services/api'

const UserDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserBookings()
  }, [])

  const fetchUserBookings = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await api.get(`/api/bookings/user/${userId}`)
      setBookings(response.data)
    } catch (err) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await api.delete(`/api/bookings/${bookingId}`)
      // Refresh bookings
      fetchUserBookings()
    } catch (err) {
      setError('Failed to cancel booking')
    }
  }

  if (loading) {
    return <div className="loading-container">Loading your bookings...</div>
  }

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>
      <div className="dashboard-content">
        <h2>My Bookings</h2>
        {error && <div className="error-message">{error}</div>}
        {bookings.length === 0 ? (
          <p>You haven't booked any events yet.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <h3>{booking.eventTitle}</h3>
                <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                {booking.status === 'CONFIRMED' && (
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn btn-secondary"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
