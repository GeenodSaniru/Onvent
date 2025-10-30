import api from './api';

class TicketService {
  // Book a ticket
  bookTicket(bookingData) {
    return api.post('/tickets/book', bookingData);
  }

  // Check seat availability for an event
  checkAvailability(eventId) {
    return api.get(`/tickets/availability/${eventId}`);
  }

  // Get current user's bookings
  getMyBookings() {
    return api.get('/tickets/my-bookings');
  }

  // Cancel a booking
  cancelBooking(ticketId) {
    return api.delete(`/tickets/${ticketId}/cancel`);
  }

  // Download PDF ticket
  downloadTicketPdf(ticketId) {
    return api.get(`/tickets/${ticketId}/pdf`, {
      responseType: 'blob' // Important for handling binary data
    });
  }

  // Legacy methods
  getAllTickets() {
    return api.get('/tickets/all');
  }

  getTicketById(id) {
    return api.get(`/tickets/${id}`);
  }

  createTicket(ticket) {
    return api.post('/tickets/create', ticket);
  }

  updateTicket(id, ticket) {
    return api.put(`/tickets/update/${id}`, ticket);
  }

  deleteTicket(id) {
    return api.delete(`/tickets/delete/${id}`);
  }
}

export default new TicketService();