package ac.nsbm.onvent.newsystem.repository;

import ac.nsbm.onvent.newsystem.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
}