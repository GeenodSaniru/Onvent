package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.dto.AuthResponse;
import ac.nsbm.onvent.newsystem.dto.SignupRequest;
import ac.nsbm.onvent.newsystem.entity.Role;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public User registerUser(SignupRequest signupRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(signupRequest.getUsername())) {
                throw new RuntimeException("Username is already taken");
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            
            // Validate password strength
            validatePassword(signupRequest.getPassword());
            
            // Create new user
            User user = User.builder()
                    .username(signupRequest.getUsername())
                    .name(signupRequest.getName())
                    .email(signupRequest.getEmail())
                    .password(passwordEncoder.encode(signupRequest.getPassword()))
                    .role(userRepository.count() == 0 ? Role.ADMIN : Role.USER) // First user becomes admin
                    .build();
                    
            return userRepository.save(user);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error during user registration: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new RuntimeException("Password must contain at least one digit");
        }
    }
    
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail);
    }
    
    public AuthResponse convertToAuthResponse(User user, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .message(message)
                .build();
    }
}