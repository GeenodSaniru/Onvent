package ac.nsbm.onvent.newsystem.repository;

import ac.nsbm.onvent.newsystem.entity.Event;
import ac.nsbm.onvent.newsystem.repository.custom.CustomEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, CustomEventRepository {
    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Event> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<Event> findByDateAfter(LocalDateTime date, Pageable pageable);
    
    List<Event> findBySeatsGreaterThan(Integer seats);

    @Query(value = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'events' ORDER BY ordinal_position", nativeQuery = true)
    List<Object[]> getEventTableColumns();
}