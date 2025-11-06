package ac.nsbm.onvent.newsystem.repository.custom;

import ac.nsbm.onvent.newsystem.entity.Event;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class CustomEventRepositoryImpl implements CustomEventRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Page<Event> findEventsWithFilters(String title, String category, LocalDateTime date, Pageable pageable) {
        StringBuilder countQueryStr = new StringBuilder("SELECT COUNT(e) FROM Event e WHERE 1=1");
        StringBuilder dataQueryStr = new StringBuilder("SELECT e FROM Event e WHERE 1=1");
        
        if (title != null && !title.isEmpty()) {
            countQueryStr.append(" AND LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))");
            dataQueryStr.append(" AND LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))");
        }
        
        if (category != null && !category.isEmpty()) {
            countQueryStr.append(" AND LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))");
            dataQueryStr.append(" AND LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))");
        }
        
        if (date != null) {
            countQueryStr.append(" AND e.date >= :date");
            dataQueryStr.append(" AND e.date >= :date");
        }
        
        dataQueryStr.append(" ORDER BY e.date");
        
        // Count query
        Query countQuery = entityManager.createQuery(countQueryStr.toString());
        if (title != null && !title.isEmpty()) {
            countQuery.setParameter("title", title);
        }
        if (category != null && !category.isEmpty()) {
            countQuery.setParameter("category", category);
        }
        if (date != null) {
            countQuery.setParameter("date", date);
        }
        long total = (Long) countQuery.getSingleResult();
        
        // Data query
        Query dataQuery = entityManager.createQuery(dataQueryStr.toString(), Event.class)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize());
        
        if (title != null && !title.isEmpty()) {
            dataQuery.setParameter("title", title);
        }
        if (category != null && !category.isEmpty()) {
            dataQuery.setParameter("category", category);
        }
        if (date != null) {
            dataQuery.setParameter("date", date);
        }
        
        List<Event> events = dataQuery.getResultList();
        
        return new PageImpl<>(events, pageable, total);
    }
}