package ac.nsbm.onvent.model.dto;

import ac.nsbm.onvent.model.entity.User;

public class AuthResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private User.Role role;
    private String message;
    
    // Default constructor
    public AuthResponse() {}
    
    // Constructor with all fields
    public AuthResponse(Long id, String username, String name, String email, User.Role role, String message) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
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
    
    public User.Role getRole() {
        return role;
    }
    
    public void setRole(User.Role role) {
        this.role = role;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    // Builder pattern
    public static class Builder {
        private AuthResponse response = new AuthResponse();
        
        public Builder id(Long id) {
            response.id = id;
            return this;
        }
        
        public Builder username(String username) {
            response.username = username;
            return this;
        }
        
        public Builder name(String name) {
            response.name = name;
            return this;
        }
        
        public Builder email(String email) {
            response.email = email;
            return this;
        }
        
        public Builder role(User.Role role) {
            response.role = role;
            return this;
        }
        
        public Builder message(String message) {
            response.message = message;
            return this;
        }
        
        public AuthResponse build() {
            return response;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}