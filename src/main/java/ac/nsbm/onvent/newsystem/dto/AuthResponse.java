package ac.nsbm.onvent.newsystem.dto;

import ac.nsbm.onvent.newsystem.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private Role role;
    private String message;
}