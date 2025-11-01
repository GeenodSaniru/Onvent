import api from './api'

class TicketService {
  // Book tickets
  async bookTicket(bookingData) {
    try {
      const response = await api.post('/v1/tickets/book', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user tickets with pagination
  async getUserTickets(page = 0, size = 10) {
    try {
      const response = await api.get(`/v1/tickets/user?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all user tickets as list
  async getUserTicketsList() {
    try {
      const response = await api.get('/v1/tickets/user/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cancel ticket
  async cancelTicket(ticketId) {
    try {
      const response = await api.delete(`/v1/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get event tickets (admin only)
  async getEventTickets(eventId, page = 0, size = 10) {
    try {
      const response = await api.get(`/v1/tickets/admin/event/${eventId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketService()