package ac.nsbm.onvent.newsystem.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private Long totalEvents;
    private Long totalTickets;
    private Double totalRevenue;
    
    public DashboardStatsDTO() {
        this.totalEvents = 0L;
        this.totalTickets = 0L;
        this.totalRevenue = 0.0;
    }
    
    public DashboardStatsDTO(Long totalEvents, Long totalTickets, Double totalRevenue) {
        this.totalEvents = totalEvents;
        this.totalTickets = totalTickets;
        this.totalRevenue = totalRevenue;
    }
}