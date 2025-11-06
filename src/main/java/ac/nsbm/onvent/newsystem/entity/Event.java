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
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "price", nullable = false)
    private Double price;
    
    @Column(name = "seats")
    private Integer seats;
    
    @Column(name = "image")
    private String image;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
}