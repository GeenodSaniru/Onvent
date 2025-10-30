import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ticketService from '../services/ticketService';
import eventService from '../services/eventService';

const TicketBooking = () => {
  const { eventId } = useParams();
  const [ticket, setTicket] = useState({
    purchaseDate: new Date().toISOString().slice(0, 16),
    ticketCode: '',
    user: { id: '' },
    event: { id: eventId || '' }
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    // If we have an eventId from the URL, fetch event details
    if (eventId) {
      fetchEventDetails(eventId);
      // Pre-fill the event ID in the form
      setTicket(prev => ({
        ...prev,
        event: { id: eventId }
      }));
    }
  }, [eventId]);

  const fetchEventDetails = async (id) => {
    try {
      const response = await eventService.getEventById(id);
      setEventDetails(response.data);
    } catch (error) {
      setMessage('Error fetching event details: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId') {
      setTicket({
        ...ticket,
        user: { id: value }
      });
    } else if (name === 'eventId') {
      setTicket({
        ...ticket,
        event: { id: value }
      });
      // Fetch event details when event ID changes
      if (value) {
        fetchEventDetails(value);
      }
    } else if (name === 'ticketCode') {
      setTicket({
        ...ticket,
        ticketCode: value
      });
    } else if (name === 'purchaseDate') {
      setTicket({
        ...ticket,
        purchaseDate: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Format the ticket data
      const ticketData = {
        purchaseDate: ticket.purchaseDate,
        ticketCode: ticket.ticketCode || 'TICKET-' + Date.now(),
        user: { id: parseInt(ticket.user.id) },
        event: { id: parseInt(ticket.event.id) }
      };
      
      const response = await ticketService.bookTicket(ticketData);
      setMessage('Ticket booked successfully!');
      setTicket({
        purchaseDate: new Date().toISOString().slice(0, 16),
        ticketCode: '',
        user: { id: '' },
        event: { id: eventId || '' }
      });
    } catch (error) {
      setMessage('Error booking ticket: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ticket-form">
      <h2>{eventId ? `Book Ticket for "${eventDetails?.title || 'Event'}"` : 'Book Ticket'}</h2>
      {eventDetails && (
        <div className="event-details">
          <h3>Event Details:</h3>
          <p><strong>Title:</strong> {eventDetails.title}</p>
          <p><strong>Location:</strong> {eventDetails.location}</p>
          <p><strong>Date:</strong> {new Date(eventDetails.eventDate).toLocaleString()}</p>
          <p><strong>Price:</strong> ${eventDetails.price.toFixed(2)}</p>
        </div>
      )}
      {message && (
        <div className={message.includes('successfully') ? 'message' : 'error'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date:</label>
          <input
            type="datetime-local"
            id="purchaseDate"
            name="purchaseDate"
            value={ticket.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ticketCode">Ticket Code (Optional):</label>
          <input
            type="text"
            id="ticketCode"
            name="ticketCode"
            value={ticket.ticketCode}
            onChange={handleChange}
            placeholder="Leave blank to auto-generate"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={ticket.user.id}
            onChange={handleChange}
            required
            placeholder="Enter user ID"
          />
        </div>
        {!eventId && (
          <div className="form-group">
            <label htmlFor="eventId">Event ID:</label>
            <input
              type="number"
              id="eventId"
              name="eventId"
              value={ticket.event.id}
              onChange={handleChange}
              required
              placeholder="Enter event ID"
            />
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Booking Ticket...' : 'Book Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketBooking;