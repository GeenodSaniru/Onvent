package ac.nsbm.onvent.newsystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}