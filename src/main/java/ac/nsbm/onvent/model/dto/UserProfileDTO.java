package ac.nsbm.onvent.model.dto;

import ac.nsbm.onvent.model.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserProfileDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private String username;
    private User.Role role;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public User.Role getRole() {
        return role;
    }
    
    public void setRole(User.Role role) {
        this.role = role;
    }
    
    // Builder pattern
    public static class Builder {
        private UserProfileDTO profile = new UserProfileDTO();
        
        public Builder id(Long id) {
            profile.id = id;
            return this;
        }
        
        public Builder name(String name) {
            profile.name = name;
            return this;
        }
        
        public Builder email(String email) {
            profile.email = email;
            return this;
        }
        
        public Builder username(String username) {
            profile.username = username;
            return this;
        }
        
        public Builder role(User.Role role) {
            profile.role = role;
            return this;
        }
        
        public UserProfileDTO build() {
            return profile;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}