package ac.nsbm.onvent.newsystem.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private Long organizerId;
    private String organizerName;
}