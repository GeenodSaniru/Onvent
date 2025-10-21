package ac.nsbm.onvent.service;

import ac.nsbm.onvent.exception.InsufficientSeatsException;
import ac.nsbm.onvent.exception.InvalidBookingException;
import ac.nsbm.onvent.exception.ResourceNotFoundException;
import ac.nsbm.onvent.model.dto.AvailabilityResponse;
import ac.nsbm.onvent.model.dto.BookingRequest;
import ac.nsbm.onvent.model.dto.BookingResponse;
import ac.nsbm.onvent.model.entity.Event;
import ac.nsbm.onvent.model.entity.Ticket;
import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.repository.EventRepository;
import ac.nsbm.onvent.repository.TicketRepository;
import ac.nsbm.onvent.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    /**
     * Book tickets for an event with seat validation
     */
    @Transactional
    public BookingResponse bookTicket(BookingRequest request) {
        // Validate request
        if (request.getUserId() == null || request.getEventId() == null) {
            throw new InvalidBookingException("User ID and Event ID are required");
        }
        
        // Default to 1 ticket if not specified
        int numberOfTickets = request.getNumberOfTickets() != null ? request.getNumberOfTickets() : 1;
        
        if (numberOfTickets <= 0) {
            throw new InvalidBookingException("Number of tickets must be greater than 0");
        }
        
        // Fetch user and event
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));
        
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));
        
        // Check if event has already occurred
        if (event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new InvalidBookingException("Cannot book tickets for past events");
        }
        
        // Check available seats
        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(event.getId());
        int availableSeats = event.getMaxAttendees() - bookedSeats.intValue();
        
        if (availableSeats < numberOfTickets) {
            throw new InsufficientSeatsException("Insufficient seats available. Available: " + availableSeats + ", Requested: " + numberOfTickets);
        }
        
        // For simplicity, we'll book just one ticket (can be extended for multiple)
        // Generate unique ticket code
        String ticketCode = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Create ticket
        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setEvent(event);
        ticket.setTicketCode(ticketCode);
        ticket.setPurchaseDate(LocalDateTime.now());
        ticket.setStatus(Ticket.TicketStatus.ACTIVE);
        
        ticket = ticketRepository.save(ticket);
        
        // Build response
        return buildBookingResponse(ticket, availableSeats - numberOfTickets);
    }
    
    /**
     * Check seat availability for an event
     */
    public AvailabilityResponse checkAvailability(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
        
        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(eventId);
        int availableSeats = event.getMaxAttendees() - bookedSeats.intValue();
        
        return new AvailabilityResponse(
                event.getId(),
                event.getTitle(),
                event.getMaxAttendees(),
                bookedSeats.intValue(),
                availableSeats,
                availableSeats > 0
        );
    }
    
    /**
     * Get all bookings for a specific user
     */
    public List<BookingResponse> getUserBookings(Long userId) {
        List<Ticket> tickets = ticketRepository.findActiveTicketsByUserId(userId);
        
        return tickets.stream()
                .map(ticket -> {
                    Long bookedSeats = ticketRepository.countActiveTicketsByEventId(ticket.getEvent().getId());
                    int availableSeats = ticket.getEvent().getMaxAttendees() - bookedSeats.intValue();
                    return buildBookingResponse(ticket, availableSeats);
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Get bookings for the current authenticated user
     */
    public List<BookingResponse> getMyBookings(User currentUser) {
        return getUserBookings(currentUser.getId());
    }
    
    /**
     * Cancel a booking
     */
    @Transactional
    public void cancelBooking(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
        
        // Verify ownership
        if (!ticket.getUser().getId().equals(userId)) {
            throw new InvalidBookingException("You can only cancel your own bookings");
        }
        
        // Check if already cancelled
        if (ticket.getStatus() == Ticket.TicketStatus.CANCELLED) {
            throw new InvalidBookingException("Ticket is already cancelled");
        }
        
        // Check if event has already occurred
        if (ticket.getEvent().getEventDate().isBefore(LocalDateTime.now())) {
            throw new InvalidBookingException("Cannot cancel tickets for past events");
        }
        
        // Cancel the ticket
        ticket.setStatus(Ticket.TicketStatus.CANCELLED);
        ticketRepository.save(ticket);
    }
    
    /**
     * Helper method to build booking response
     */
    private BookingResponse buildBookingResponse(Ticket ticket, int availableSeats) {
        BookingResponse response = new BookingResponse();
        response.setTicketId(ticket.getId());
        response.setTicketCode(ticket.getTicketCode());
        response.setUserId(ticket.getUser().getId());
        response.setUserName(ticket.getUser().getName());
        response.setEventId(ticket.getEvent().getId());
        response.setEventTitle(ticket.getEvent().getTitle());
        response.setEventLocation(ticket.getEvent().getLocation());
        response.setEventDate(ticket.getEvent().getEventDate());
        response.setEventPrice(ticket.getEvent().getPrice());
        response.setPurchaseDate(ticket.getPurchaseDate());
        response.setStatus(ticket.getStatus().name());
        response.setAvailableSeats(availableSeats);
        return response;
    }

    // Legacy methods for backwards compatibility
    
    public Ticket createTicket(Ticket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus(Ticket.TicketStatus.ACTIVE);
        }
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setPurchaseDate(ticketDetails.getPurchaseDate());
        ticket.setTicketCode(ticketDetails.getTicketCode());
        ticket.setUser(ticketDetails.getUser());
        ticket.setEvent(ticketDetails.getEvent());

        return ticketRepository.save(ticket);
    }

    public void deleteTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticketRepository.delete(ticket);
    }
}