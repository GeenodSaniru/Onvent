package ac.nsbm.onvent.newsystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Event ID is required")
    private Long eventId;
    
    private Long ticketTypeId;
    
    @Min(value = 1, message = "Number of tickets must be at least 1")
    private Integer numberOfTickets;
}