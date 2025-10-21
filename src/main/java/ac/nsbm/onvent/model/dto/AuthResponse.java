package ac.nsbm.onvent.model.dto;

import ac.nsbm.onvent.model.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private Role role;
    private String message;
}
