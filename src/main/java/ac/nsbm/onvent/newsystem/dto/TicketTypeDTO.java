package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeDTO {
    private String name;
    private Double price;
    private Integer quantity;
}