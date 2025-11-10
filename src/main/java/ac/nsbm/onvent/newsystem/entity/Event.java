package ac.nsbm.onvent.newsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Column(name = "date", nullable = false)
    private LocalDateTime date;
    
    // Temporary fix for schema inconsistency - map both date and event_date columns
    @Column(name = "event_date")
    private LocalDateTime eventDate;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "price", nullable = false)
    private Double price;
    
    // Handle both seats and max_attendees columns
    @Column(name = "seats")
    private Integer seats;
    
    @Column(name = "max_attendees")
    private Integer maxAttendees;
    
    @Column(name = "image")
    private String image;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    // Ensure both date and seats fields are synchronized
    @PrePersist
    @PreUpdate
    public void syncFields() {
        // Sync date fields
        if (this.date != null) {
            this.eventDate = this.date;
        } else if (this.eventDate != null) {
            this.date = this.eventDate;
        }
        
        // Sync seats fields
        if (this.seats != null) {
            this.maxAttendees = this.seats;
        } else if (this.maxAttendees != null) {
            this.seats = this.maxAttendees;
        }
    }
}