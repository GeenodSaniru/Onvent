import api from './api';

class TicketService {
  // New booking endpoints
  
  // Book a ticket for an event
  bookTicket(bookingRequest) {
    return api.post('/tickets/book', bookingRequest);
  }
  
  // Check seat availability for an event
  checkAvailability(eventId) {
    return api.get(`/tickets/availability/${eventId}`);
  }
  
  // Get all bookings for a user
  getUserBookings(userId) {
    return api.get(`/tickets/user/${userId}/bookings`);
  }
  
  // Get current user's bookings
  getMyBookings() {
    return api.get('/tickets/my-bookings');
  }
  
  // Cancel a booking
  cancelBooking(ticketId) {
    return api.delete(`/tickets/${ticketId}/cancel`);
  }
  
  // Legacy endpoints
  
  // Create a new ticket
  createTicket(ticket) {
    return api.post('/tickets/create', ticket);
  }

  // Get all tickets
  getAllTickets() {
    return api.get('/tickets/all');
  }

  // Get ticket by ID
  getTicketById(id) {
    return api.get(`/tickets/${id}`);
  }

  // Update ticket by ID
  updateTicket(id, ticket) {
    return api.put(`/tickets/update/${id}`, ticket);
  }

  // Delete ticket by ID
  deleteTicket(id) {
    return api.delete(`/tickets/delete/${id}`);
  }
}

export default new TicketService();