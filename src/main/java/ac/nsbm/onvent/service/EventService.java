package ac.nsbm.onvent.service;

import ac.nsbm.onvent.model.entity.Event;
import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.model.dto.EventCreateRequest;
import ac.nsbm.onvent.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event createEventForUser(EventCreateRequest eventRequest, User user) {
        Event event = new Event();
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setLocation(eventRequest.getLocation());
        event.setEventDate(eventRequest.getEventDate());
        event.setPrice(eventRequest.getPrice());
        event.setMaxAttendees(eventRequest.getMaxAttendees());
        event.setOrganizer(user);
        
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setEventDate(eventDetails.getEventDate());
        event.setPrice(eventDetails.getPrice());
        event.setMaxAttendees(eventDetails.getMaxAttendees());
        event.setOrganizer(eventDetails.getOrganizer());

        return eventRepository.save(event);
    }

    public void deleteEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        eventRepository.delete(event);
    }
}