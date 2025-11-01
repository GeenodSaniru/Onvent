package ac.nsbm.onvent.newsystem.repository;

import ac.nsbm.onvent.newsystem.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Event> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<Event> findByDateAfter(LocalDateTime date, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE " +
           "(:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:category IS NULL OR LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:date IS NULL OR e.date >= :date)")
    Page<Event> findEventsWithFilters(@Param("title") String title, 
                                     @Param("category") String category, 
                                     @Param("date") LocalDateTime date, 
                                     Pageable pageable);
    
    List<Event> findBySeatsGreaterThan(Integer seats);
}