package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long ticketId;
    private String ticketCode;
    private Long userId;
    private String userName;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDate;
    private Double eventPrice;
    private LocalDateTime purchaseDate;
    private String status;
    private Integer availableSeats;
}
