package ac.nsbm.onvent.newsystem.repository;

import ac.nsbm.onvent.newsystem.entity.Ticket;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    Page<Ticket> findByUser(User user, Pageable pageable);
    List<Ticket> findByEvent(Event event);
    Page<Ticket> findByEvent(Event event, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event.id = :eventId AND t.status = 'ACTIVE'")
    Long countActiveTicketsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.ticketType.id = :ticketTypeId AND t.status = 'ACTIVE'")
    Long countActiveTicketsByTicketTypeId(@Param("ticketTypeId") Long ticketTypeId);
    
    @Query("SELECT t FROM Ticket t WHERE t.user.id = :userId AND t.status = 'ACTIVE'")
    List<Ticket> findActiveTicketsByUserId(@Param("userId") Long userId);
}