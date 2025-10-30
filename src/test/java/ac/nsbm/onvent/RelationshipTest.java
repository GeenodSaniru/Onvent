package ac.nsbm.onvent;

import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.model.entity.Event;
import ac.nsbm.onvent.model.entity.Ticket;
import ac.nsbm.onvent.repository.UserRepository;
import ac.nsbm.onvent.repository.EventRepository;
import ac.nsbm.onvent.repository.TicketRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class RelationshipTest {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Test
    public void testRelationships() {
        // Create a user
        User user = new User();
        user.setUsername("testuser");
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(User.Role.USER);
        user = userRepository.save(user);
        
        // Create an event
        Event event = new Event(
            "Test Event",
            "Test Description",
            "Test Location",
            LocalDateTime.now().plusDays(30),
            100.0,
            50,
            user
        );
        event = eventRepository.save(event);
        
        // Create a ticket
        Ticket ticket = new Ticket(
            LocalDateTime.now(),
            "TICKET-001",
            user,
            event
        );
        ticket = ticketRepository.save(ticket);
        
        // Test User -> Events relationship
        List<Event> events = user.getEvents();
        assertThat(events).hasSize(1);
        assertThat(events.get(0)).isEqualTo(event);
        
        // Test User -> Tickets relationship
        List<Ticket> tickets = user.getTickets();
        assertThat(tickets).hasSize(1);
        assertThat(tickets.get(0)).isEqualTo(ticket);
        
        // Test Event -> Tickets relationship
        List<Ticket> eventTickets = event.getTickets();
        assertThat(eventTickets).hasSize(1);
        assertThat(eventTickets.get(0)).isEqualTo(ticket);
        
        // Test Ticket -> User relationship
        User ticketUser = ticket.getUser();
        assertThat(ticketUser).isEqualTo(user);
        
        // Test Ticket -> Event relationship
        Event ticketEvent = ticket.getEvent();
        assertThat(ticketEvent).isEqualTo(event);
        
        System.out.println("All relationships verified successfully!");
    }
}