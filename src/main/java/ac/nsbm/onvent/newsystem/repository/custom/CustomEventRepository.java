package ac.nsbm.onvent.newsystem.repository.custom;

import ac.nsbm.onvent.newsystem.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface CustomEventRepository {
    Page<Event> findEventsWithFilters(String title, String category, LocalDateTime date, Pageable pageable);
}