package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private Long eventId;
    private String eventTitle;
    private Integer seats;
    private Integer bookedSeats;
    private Integer availableSeats;
    private boolean isAvailable;
}
