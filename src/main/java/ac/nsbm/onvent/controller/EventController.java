package ac.nsbm.onvent.controller;

import ac.nsbm.onvent.model.entity.Event;
import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.model.dto.EventCreateRequest;
import ac.nsbm.onvent.service.EventService;
import ac.nsbm.onvent.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestBody EventCreateRequest eventRequest) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Event createdEvent = eventService.createEventForUser(eventRequest, user);
            
            // Return a simplified response to avoid circular references
            return new ResponseEntity<>(createEventResponse(createdEvent), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while creating the event: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Object>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<Object> eventResponses = events.stream()
                .map(this::createEventResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(eventResponses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(event -> new ResponseEntity<>(createEventResponse(event), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventCreateRequest eventRequest) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if the user is the organizer of the event or an admin
            Event existingEvent = eventService.getEventById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            
            if (!existingEvent.getOrganizer().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("You don't have permission to update this event"));
            }

            // Update event details
            existingEvent.setTitle(eventRequest.getTitle());
            existingEvent.setDescription(eventRequest.getDescription());
            existingEvent.setLocation(eventRequest.getLocation());
            existingEvent.setEventDate(eventRequest.getEventDate());
            existingEvent.setPrice(eventRequest.getPrice());
            existingEvent.setMaxAttendees(eventRequest.getMaxAttendees());

            Event updatedEvent = eventService.updateEvent(id, existingEvent);
            
            // Return a simplified response to avoid circular references
            return new ResponseEntity<>(createEventResponse(updatedEvent), HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating the event: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEventById(@PathVariable Long id) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userService.findByUsernameOrEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if the user is the organizer of the event or an admin
            Event existingEvent = eventService.getEventById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            
            if (!existingEvent.getOrganizer().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("You don't have permission to delete this event"));
            }

            eventService.deleteEventById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the event: " + e.getMessage()));
        }
    }

    /**
     * Admin can delete any event
     * DELETE /events/admin/delete/{id}
     */
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> adminDeleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEventById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the event: " + e.getMessage()));
        }
    }

    /**
     * Helper method to create a simplified event response to avoid circular references
     */
    private Object createEventResponse(Event event) {
        return new Object() {
            public Long id = event.getId();
            public String title = event.getTitle();
            public String description = event.getDescription();
            public String location = event.getLocation();
            public java.time.LocalDateTime eventDate = event.getEventDate();
            public Double price = event.getPrice();
            public Integer maxAttendees = event.getMaxAttendees();
            public Object organizer = new Object() {
                public Long id = event.getOrganizer().getId();
                public String username = event.getOrganizer().getUsername();
                public String name = event.getOrganizer().getName();
                public String email = event.getOrganizer().getEmail();
                public String role = event.getOrganizer().getRole().name();
            };
        };
    }

    /**
     * Helper method to create error response
     */
    private Object createErrorResponse(String message) {
        return new Object() {
            public String error = message;
        };
    }
}