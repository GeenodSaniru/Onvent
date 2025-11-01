package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.dto.EventDTO;
import ac.nsbm.onvent.newsystem.entity.Event;
import ac.nsbm.onvent.newsystem.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    private final EventRepository eventRepository;
    
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    
    @Transactional
    public Event createEvent(EventDTO eventDTO) {
        Event event = Event.builder()
                .title(eventDTO.getTitle())
                .description(eventDTO.getDescription())
                .location(eventDTO.getVenue())
                .date(eventDTO.getDate())
                .category(eventDTO.getCategory())
                .price(eventDTO.getPrice())
                .seats(eventDTO.getSeats())
                .image(eventDTO.getImageUrl())
                .build();
                
        return eventRepository.save(event);
    }
    
    @Transactional
    public Event updateEvent(Long id, EventDTO eventDTO) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
                
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setLocation(eventDTO.getVenue());
        event.setDate(eventDTO.getDate());
        event.setCategory(eventDTO.getCategory());
        event.setPrice(eventDTO.getPrice());
        event.setSeats(eventDTO.getSeats());
        event.setImage(eventDTO.getImageUrl());
        
        return eventRepository.save(event);
    }
    
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }
    
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }
    
    public Page<Event> searchEvents(String title, String category, LocalDateTime date, Pageable pageable) {
        return eventRepository.findEventsWithFilters(title, category, date, pageable);
    }
    
    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventRepository.delete(event);
    }
    
    public List<Event> getAvailableEvents() {
        return eventRepository.findBySeatsGreaterThan(0);
    }
}