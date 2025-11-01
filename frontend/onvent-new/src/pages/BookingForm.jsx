import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import eventService from '../services/eventService'
import ticketService from '../services/ticketService'
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaChair } from 'react-icons/fa'

const BookingForm = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const quantity = watch('quantity', 1)

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await eventService.getEventById(eventId)
      setEvent(data)
    } catch (err) {
      setError('Failed to load event details')
      console.error('Error loading event:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setBookingLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const bookingData = {
        eventId: parseInt(eventId),
        quantity: parseInt(data.quantity)
      }
      
      const response = await ticketService.bookTicket(bookingData)
      
      if (response) {
        setSuccess('Tickets booked successfully!')
        // Redirect to user dashboard after a short delay
        setTimeout(() => {
          navigate('/user/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book tickets. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'Event not found'}
        </div>
      </div>
    )
  }

  const totalAmount = (event.price * quantity).toFixed(2)

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h1>
            
            {/* Event Summary */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaChair className="mr-2" />
                  {event.seats} seats available
                </div>
                <div className="flex items-center text-gray-600">
                  <FaTicketAlt className="mr-2" />
                  Price: ${event.price?.toFixed(2)} per ticket
                </div>
              </div>
            </div>
            
            {error && (
              <div className="error-message mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message mb-6">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="quantity" className="form-label">
                  Number of Tickets
                </label>
                <select
                  id="quantity"
                  {...register('quantity', { 
                    required: 'Please select number of tickets',
                    min: {
                      value: 1,
                      message: 'At least 1 ticket is required'
                    },
                    max: {
                      value: Math.min(event.seats, 10),
                      message: `Maximum ${Math.min(event.seats, 10)} tickets allowed`
                    }
                  })}
                  className="form-input"
                  disabled={bookingLoading}
                >
                  {[...Array(Math.min(event.seats, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} ticket{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.quantity.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Available seats: {event.seats}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                    <p className="text-gray-600">{quantity} ticket{quantity > 1 ? 's' : ''} × ${event.price?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">Total: ${totalAmount}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || event.seats === 0}
                  className="flex-1 btn-primary flex justify-center items-center"
                >
                  {bookingLoading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Processing...
                    </>
                  ) : event.seats === 0 ? (
                    'Sold Out'
                  ) : (
                    `Book Tickets ($${totalAmount})`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm