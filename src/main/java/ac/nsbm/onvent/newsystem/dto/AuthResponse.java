package ac.nsbm.onvent.newsystem.dto;

import ac.nsbm.onvent.newsystem.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private User.Role role;
    private String message;
}