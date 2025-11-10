package ac.nsbm.onvent.newsystem.controller;

import ac.nsbm.onvent.newsystem.dto.BookingRequest;
import ac.nsbm.onvent.newsystem.dto.BookingResponse;
import ac.nsbm.onvent.newsystem.dto.DashboardStatsDTO;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.service.TicketService;
import ac.nsbm.onvent.newsystem.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177", "https://onvent.netlify.app"}, allowCredentials = "true")
public class TicketController {
    
    private final TicketService ticketService;
    private final UserService userService;
    
    public TicketController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }
    
    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest bookingRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to book tickets"));
            }
            
            String username = authentication.getName();
            User currentUser = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Set the user ID in the booking request
            bookingRequest.setUserId(currentUser.getId());
            
            BookingResponse response = ticketService.bookTicket(bookingRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to book ticket: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserTickets(@RequestParam(defaultValue = "0") int page, 
                                          @RequestParam(defaultValue = "10") int size) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to view your tickets"));
            }
            
            String username = authentication.getName();
            User currentUser = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Pageable pageable = PageRequest.of(page, size);
            Page<BookingResponse> tickets = ticketService.getUserBookings(currentUser.getId(), pageable);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user tickets: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/list")
    public ResponseEntity<?> getUserTicketsList() {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to view your tickets"));
            }
            
            String username = authentication.getName();
            User currentUser = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<BookingResponse> tickets = ticketService.getUserBookingsList(currentUser.getId());
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user tickets: " + e.getMessage()));
        }
    }
    
    /**
     * Get dashboard statistics for admin
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Check if user is admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to view dashboard statistics"));
            }
            
            // In a real implementation, you would check if the user has admin role
            // For now, we'll just return the stats
            
            DashboardStatsDTO stats = ticketService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch dashboard statistics: " + e.getMessage()));
        }
    }
    
    /**
     * Get event-specific booking statistics for admin
     */
    @GetMapping("/admin/event/{eventId}/stats")
    public ResponseEntity<?> getEventBookingStats(@PathVariable Long eventId) {
        try {
            // Check if user is admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to view event statistics"));
            }
            
            // Get event booking statistics
            Map<String, Object> stats = ticketService.getEventBookingStats(eventId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch event statistics: " + e.getMessage()));
        }
    }
    
    /**
     * Get event-specific booking statistics for all authenticated users
     */
    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<?> getEventBookingStatsForUsers(@PathVariable Long eventId) {
        try {
            // Check if user is authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("You must be logged in to view event statistics"));
            }
            
            // Get event booking statistics
            Map<String, Object> stats = ticketService.getEventBookingStats(eventId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch event statistics: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelTicket(@PathVariable Long id) {
        try {
            ticketService.cancelBooking(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ticket cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to cancel ticket: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}