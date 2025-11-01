package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime date;
    private String category;
    private Double price;
    private Integer seats;
    private String imageUrl;
}