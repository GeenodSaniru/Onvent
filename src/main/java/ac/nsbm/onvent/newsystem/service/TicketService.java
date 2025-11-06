package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.exception.InsufficientSeatsException;
import ac.nsbm.onvent.newsystem.exception.InvalidBookingException;
import ac.nsbm.onvent.newsystem.exception.ResourceNotFoundException;
import ac.nsbm.onvent.newsystem.dto.AvailabilityResponse;
import ac.nsbm.onvent.newsystem.dto.BookingRequest;
import ac.nsbm.onvent.newsystem.dto.BookingResponse;
import ac.nsbm.onvent.newsystem.dto.DashboardStatsDTO;
import ac.nsbm.onvent.newsystem.entity.Event;
import ac.nsbm.onvent.newsystem.entity.Ticket;
import ac.nsbm.onvent.newsystem.entity.TicketType;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.repository.EventRepository;
import ac.nsbm.onvent.newsystem.repository.TicketRepository;
import ac.nsbm.onvent.newsystem.repository.TicketTypeRepository;
import ac.nsbm.onvent.newsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
    private final TicketTypeRepository ticketTypeRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PdfService pdfService;

    public TicketService(TicketRepository ticketRepository, EventRepository eventRepository, UserRepository userRepository, TicketTypeRepository ticketTypeRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.ticketTypeRepository = ticketTypeRepository;
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
        if (event.getDate().isBefore(LocalDateTime.now())) {
            throw new InvalidBookingException("Cannot book tickets for past events");
        }
        
        TicketType ticketType = null;
        Double ticketPrice = event.getPrice(); // Default to event price
        
        // If ticket type is specified, validate it
        if (request.getTicketTypeId() != null) {
            ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket type not found with ID: " + request.getTicketTypeId()));
            
            // Verify ticket type belongs to this event
            if (!ticketType.getEvent().getId().equals(event.getId())) {
                throw new InvalidBookingException("Invalid ticket type for this event");
            }
            
            ticketPrice = ticketType.getPrice();
        }
        
        // Check available seats for this ticket type or overall event
        int availableSeats;
        if (ticketType != null) {
            // Check ticket type specific availability
            Long bookedSeats = ticketRepository.countActiveTicketsByTicketTypeId(ticketType.getId());
            availableSeats = ticketType.getQuantity() - bookedSeats.intValue();
        } else {
            // Check overall event availability
            Long bookedSeats = ticketRepository.countActiveTicketsByEventId(event.getId());
            availableSeats = event.getSeats() - bookedSeats.intValue();
        }
        
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
        ticket.setTicketType(ticketType);
        ticket.setTicketCode(ticketCode);
        ticket.setPurchaseDate(LocalDateTime.now());
        ticket.setStatus(Ticket.TicketStatus.ACTIVE.name());
        
        ticket = ticketRepository.save(ticket);
        
        // Build response
        BookingResponse response = new BookingResponse(
            ticket.getId(),
            ticket.getTicketCode(),
            ticket.getUser().getId(),
            ticket.getUser().getName(),
            ticket.getEvent().getId(),
            ticket.getEvent().getTitle(),
            ticket.getEvent().getLocation(),
            ticket.getEvent().getDate(),
            ticket.getEvent().getPrice(),
            ticket.getPurchaseDate(),
            ticket.getStatus(),
            availableSeats
        );
        
        // Send booking confirmation email
        try {
            emailService.sendBookingConfirmation(response, user.getEmail());
        } catch (Exception e) {
            // Log the error but don't fail the booking process
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * Check seat availability for an event
     */
    public AvailabilityResponse checkAvailability(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
        
        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(eventId);
        int availableSeats = event.getSeats() - bookedSeats.intValue();
        
        return new AvailabilityResponse(
                event.getId(),
                event.getTitle(),
                event.getSeats(),
                bookedSeats.intValue(),
                availableSeats,
                availableSeats > 0
        );
    }
    
    /**
     * Get dashboard statistics for admin
     */
    public DashboardStatsDTO getDashboardStats() {
        // Get total events
        long totalEvents = eventRepository.count();
        
        // Get total tickets
        long totalTickets = ticketRepository.count();
        
        // Calculate total revenue
        List<Ticket> allTickets = ticketRepository.findAll();
        double totalRevenue = allTickets.stream()
                .mapToDouble(ticket -> {
                    if (ticket.getTicketType() != null) {
                        return ticket.getTicketType().getPrice();
                    } else if (ticket.getEvent() != null) {
                        return ticket.getEvent().getPrice();
                    }
                    return 0.0;
                })
                .sum();
        
        return new DashboardStatsDTO(totalEvents, totalTickets, totalRevenue);
    }
    
    /**
     * Get all bookings for a specific user with pagination
     */
    public Page<BookingResponse> getUserBookings(Long userId, Pageable pageable) {
        List<Ticket> allTickets = ticketRepository.findActiveTicketsByUserId(userId);
        
        // Apply pagination manually since we're not using a database query with pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allTickets.size());
        
        List<Ticket> paginatedTickets = allTickets.subList(start, end);
        
        List<BookingResponse> bookingResponses = paginatedTickets.stream()
                .map(ticket -> {
                    int availableSeats;
                    if (ticket.getTicketType() != null) {
                        Long bookedSeats = ticketRepository.countActiveTicketsByTicketTypeId(ticket.getTicketType().getId());
                        availableSeats = ticket.getTicketType().getQuantity() - bookedSeats.intValue();
                    } else {
                        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(ticket.getEvent().getId());
                        availableSeats = ticket.getEvent().getSeats() - bookedSeats.intValue();
                    }
                    
                    return new BookingResponse(
                        ticket.getId(),
                        ticket.getTicketCode(),
                        ticket.getUser().getId(),
                        ticket.getUser().getName(),
                        ticket.getEvent().getId(),
                        ticket.getEvent().getTitle(),
                        ticket.getEvent().getLocation(),
                        ticket.getEvent().getDate(),
                        ticket.getEvent().getPrice(),
                        ticket.getPurchaseDate(),
                        ticket.getStatus(),
                        availableSeats
                    );
                })
                .collect(Collectors.toList());
        
        return new PageImpl<>(bookingResponses, pageable, allTickets.size());
    }
    
    /**
     * Get all bookings for a specific user as a list
     */
    public List<BookingResponse> getUserBookingsList(Long userId) {
        return getUserBookings(userId);
    }
    
    /**
     * Get all bookings for a specific user
     */
    public List<BookingResponse> getUserBookings(Long userId) {
        List<Ticket> tickets = ticketRepository.findActiveTicketsByUserId(userId);
        
        return tickets.stream()
                .map(ticket -> {
                    int availableSeats;
                    if (ticket.getTicketType() != null) {
                        Long bookedSeats = ticketRepository.countActiveTicketsByTicketTypeId(ticket.getTicketType().getId());
                        availableSeats = ticket.getTicketType().getQuantity() - bookedSeats.intValue();
                    } else {
                        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(ticket.getEvent().getId());
                        availableSeats = ticket.getEvent().getSeats() - bookedSeats.intValue();
                    }
                    
                    return new BookingResponse(
                        ticket.getId(),
                        ticket.getTicketCode(),
                        ticket.getUser().getId(),
                        ticket.getUser().getName(),
                        ticket.getEvent().getId(),
                        ticket.getEvent().getTitle(),
                        ticket.getEvent().getLocation(),
                        ticket.getEvent().getDate(),
                        ticket.getEvent().getPrice(),
                        ticket.getPurchaseDate(),
                        ticket.getStatus(),
                        availableSeats
                    );
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
     * Cancel a booking (without userId verification - handled by controller)
     */
    @Transactional
    public void cancelBooking(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
        
        // Check if already cancelled
        if (ticket.getStatus().equals(Ticket.TicketStatus.CANCELLED.name())) {
            throw new InvalidBookingException("Ticket is already cancelled");
        }
        
        ticket.setStatus(Ticket.TicketStatus.CANCELLED.name());
        ticketRepository.save(ticket);
    }
    
    /**
     * Get all tickets (admin only)
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    /**
     * Get ticket by ID
     */
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }
}