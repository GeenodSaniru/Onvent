package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private Integer quantity;
    private Double totalPrice;
    private LocalDateTime bookingDate;
    private String status;
}