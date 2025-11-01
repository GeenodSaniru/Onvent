package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.dto.BookingRequest;
import ac.nsbm.onvent.newsystem.dto.TicketDTO;
import ac.nsbm.onvent.newsystem.entity.Event;
import ac.nsbm.onvent.newsystem.entity.Ticket;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.repository.EventRepository;
import ac.nsbm.onvent.newsystem.repository.TicketRepository;
import ac.nsbm.onvent.newsystem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    public TicketService(TicketRepository ticketRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Ticket bookTicket(BookingRequest bookingRequest, Long userId) {
        // Get user and event
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                
        Event event = eventRepository.findById(bookingRequest.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + bookingRequest.getEventId()));
        
        // Check if enough seats are available
        if (event.getSeats() < bookingRequest.getQuantity()) {
            throw new RuntimeException("Not enough seats available. Only " + event.getSeats() + " seats left.");
        }
        
        // Calculate total price
        double totalPrice = event.getPrice() * bookingRequest.getQuantity();
        
        // Create ticket
        Ticket ticket = Ticket.builder()
                .user(user)
                .event(event)
                .quantity(bookingRequest.getQuantity())
                .totalPrice(totalPrice)
                .bookingDate(LocalDateTime.now())
                .status("CONFIRMED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
                
        // Update event seats
        event.setSeats(event.getSeats() - bookingRequest.getQuantity());
        eventRepository.save(event);
        
        return ticketRepository.save(ticket);
    }
    
    public List<Ticket> getUserTickets(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return ticketRepository.findByUser(user);
    }
    
    public Page<Ticket> getUserTickets(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return ticketRepository.findByUser(user, pageable);
    }
    
    public List<Ticket> getEventTickets(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        return ticketRepository.findByEvent(event);
    }
    
    public Page<Ticket> getEventTickets(Long eventId, Pageable pageable) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        return ticketRepository.findByEvent(event, pageable);
    }
    
    @Transactional
    public void cancelTicket(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
                
        // Check if the ticket belongs to the user
        if (!ticket.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to cancel this ticket");
        }
        
        // Update event seats
        Event event = ticket.getEvent();
        event.setSeats(event.getSeats() + ticket.getQuantity());
        eventRepository.save(event);
        
        // Delete ticket
        ticketRepository.delete(ticket);
    }
}