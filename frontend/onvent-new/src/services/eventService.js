import api from './api'

class EventService {
  // Get all events with pagination
  async getEvents(page = 0, size = 10, sortBy = 'date', sortDir = 'asc') {
    try {
      const response = await api.get(`/v1/events?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search events with filters
  async searchEvents(filters = {}, page = 0, size = 10) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      params.append('page', page);
      params.append('size', size);
      
      const response = await api.get(`/v1/events/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get event by ID
  async getEventById(id) {
    try {
      const response = await api.get(`/v1/events/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new event
  async createEvent(eventData) {
    try {
      const response = await api.post('/v1/events', eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update event
  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/v1/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete event
  async deleteEvent(id) {
    try {
      const response = await api.delete(`/v1/events/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventService()