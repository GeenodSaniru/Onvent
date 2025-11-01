package ac.nsbm.onvent.newsystem.repository;

import ac.nsbm.onvent.newsystem.entity.Ticket;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    Page<Ticket> findByUser(User user, Pageable pageable);
    List<Ticket> findByEvent(Event event);
    Page<Ticket> findByEvent(Event event, Pageable pageable);
}