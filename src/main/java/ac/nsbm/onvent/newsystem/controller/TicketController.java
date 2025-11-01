package ac.nsbm.onvent.newsystem.controller;

import ac.nsbm.onvent.newsystem.dto.BookingRequest;
import ac.nsbm.onvent.newsystem.entity.Ticket;
import ac.nsbm.onvent.newsystem.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "https://onvent.netlify.app"}, allowCredentials = "true")
public class TicketController {
    
    private final TicketService ticketService;
    
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }
    
    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest bookingRequest, Authentication authentication) {
        try {
            String username = authentication.getName();
            // In a real implementation, we would get the user ID from the authentication context
            // For now, we'll use a placeholder - in practice, you'd look up the user by username
            Long userId = 1L; // This should be dynamically determined
            
            Ticket ticket = ticketService.bookTicket(bookingRequest, userId);
            return new ResponseEntity<>(ticket, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to book ticket: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserTickets(Authentication authentication,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            // In a real implementation, we would get the user ID from the authentication context
            Long userId = 1L; // This should be dynamically determined
            
            Sort sort = Sort.by("bookingDate").descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Ticket> tickets = ticketService.getUserTickets(userId, pageable);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user tickets: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/list")
    public ResponseEntity<?> getUserTicketsList(Authentication authentication) {
        try {
            String username = authentication.getName();
            // In a real implementation, we would get the user ID from the authentication context
            Long userId = 1L; // This should be dynamically determined
            
            List<Ticket> tickets = ticketService.getUserTickets(userId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user tickets: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelTicket(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            // In a real implementation, we would get the user ID from the authentication context
            Long userId = 1L; // This should be dynamically determined
            
            ticketService.cancelTicket(id, userId);
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
    
    @GetMapping("/admin/event/{eventId}")
    public ResponseEntity<?> getEventTickets(@PathVariable Long eventId,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        try {
            Sort sort = Sort.by("bookingDate").descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Ticket> tickets = ticketService.getEventTickets(eventId, pageable);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch event tickets: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}