package ac.nsbm.onvent.controller;

import ac.nsbm.onvent.exception.InsufficientSeatsException;
import ac.nsbm.onvent.exception.InvalidBookingException;
import ac.nsbm.onvent.exception.ResourceNotFoundException;
import ac.nsbm.onvent.model.dto.AvailabilityResponse;
import ac.nsbm.onvent.model.dto.BookingRequest;
import ac.nsbm.onvent.model.dto.BookingResponse;
import ac.nsbm.onvent.model.entity.Ticket;
import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.service.TicketService;
import ac.nsbm.onvent.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    public TicketController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }

    /**
     * Book a ticket for an event
     * POST /tickets/book
     */
    @PostMapping("/book")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest request) {
        try {
            BookingResponse response = ticketService.bookTicket(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (InsufficientSeatsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (InvalidBookingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while booking the ticket"));
        }
    }
    
    /**
     * Check seat availability for an event
     * GET /tickets/availability/{eventId}
     */
    @GetMapping("/availability/{eventId}")
    public ResponseEntity<?> checkAvailability(@PathVariable Long eventId) {
        try {
            AvailabilityResponse response = ticketService.checkAvailability(eventId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while checking availability"));
        }
    }
    
    /**
     * Get all bookings for a user
     * GET /tickets/user/{userId}/bookings
     */
    @GetMapping("/user/{userId}/bookings")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            List<BookingResponse> bookings = ticketService.getUserBookings(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching user bookings"));
        }
    }
    
    /**
     * Get current user's bookings
     * GET /tickets/my-bookings
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyBookings() {
        try {
            // Get current user from authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // Find the user by username
            User currentUser = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Get user's bookings
            List<BookingResponse> bookings = ticketService.getMyBookings(currentUser);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching your bookings: " + e.getMessage()));
        }
    }
    
    /**
     * Cancel a booking
     * DELETE /tickets/{ticketId}/cancel
     */
    @DeleteMapping("/{ticketId}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long ticketId) {
        try {
            // Get current user from authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // Find the user by username
            User currentUser = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Cancel the booking (the service will verify ownership)
            ticketService.cancelBooking(ticketId, currentUser.getId());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (InvalidBookingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while cancelling the booking"));
        }
    }
    
    /**
     * Helper method to create error response
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
    
    // Legacy endpoints for backwards compatibility

    // Legacy endpoints for backwards compatibility
    
    @PostMapping("/create")
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        try {
            Ticket createdTicket = ticketService.createTicket(ticket);
            return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ticket -> new ResponseEntity<>(ticket, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketDetails) {
        try {
            Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
            return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTicketById(@PathVariable Long id) {
        try {
            ticketService.deleteTicketById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}