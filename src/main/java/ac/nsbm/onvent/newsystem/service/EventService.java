package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.dto.EventDTO;
import ac.nsbm.onvent.newsystem.entity.Event;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.repository.EventRepository;
import ac.nsbm.onvent.newsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EventDTO> searchEvents(String title, String category, LocalDateTime date, Pageable pageable) {
        Page<Event> events = eventRepository.findEventsWithFilters(title, category, date, pageable);
        return events.map(this::convertToDTO);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return convertToDTO(event);
    }

    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, String organizerUsername) {
        // Fetch the organizer user
        User organizer = userRepository.findByUsername(organizerUsername)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        // Create event with organizer
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setLocation(eventDTO.getVenue());
        event.setDate(eventDTO.getDate());
        event.setCategory(eventDTO.getCategory());
        event.setPrice(eventDTO.getPrice());
        event.setSeats(eventDTO.getSeats());
        event.setImage(eventDTO.getImageUrl());
        event.setOrganizer(organizer);

        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    @Transactional
    public EventDTO updateEvent(Long id, EventDTO eventDTO, String organizerUsername) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Check if the current user is the organizer of the event
        if (!existingEvent.getOrganizer().getUsername().equals(organizerUsername)) {
            throw new RuntimeException("You are not authorized to update this event");
        }

        // Update event details
        existingEvent.setTitle(eventDTO.getTitle());
        existingEvent.setDescription(eventDTO.getDescription());
        existingEvent.setLocation(eventDTO.getVenue());
        existingEvent.setDate(eventDTO.getDate());
        existingEvent.setCategory(eventDTO.getCategory());
        existingEvent.setPrice(eventDTO.getPrice());
        existingEvent.setSeats(eventDTO.getSeats());
        existingEvent.setImage(eventDTO.getImageUrl());

        Event updatedEvent = eventRepository.save(existingEvent);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id, String organizerUsername) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Check if the current user is the organizer of the event
        if (!existingEvent.getOrganizer().getUsername().equals(organizerUsername)) {
            throw new RuntimeException("You are not authorized to delete this event");
        }

        eventRepository.deleteById(id);
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setVenue(event.getLocation());
        eventDTO.setDate(event.getDate());
        eventDTO.setCategory(event.getCategory());
        eventDTO.setPrice(event.getPrice());
        eventDTO.setSeats(event.getSeats());
        eventDTO.setImageUrl(event.getImage());
        eventDTO.setOrganizerId(event.getOrganizer().getId());
        eventDTO.setOrganizerName(event.getOrganizer().getName());
        return eventDTO;
    }
}