package ac.nsbm.onvent.service;

import ac.nsbm.onvent.model.dto.SignupRequest;
import ac.nsbm.onvent.model.dto.UserProfileDTO;
import ac.nsbm.onvent.model.entity.Role;
import ac.nsbm.onvent.model.entity.User;
import ac.nsbm.onvent.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        // Check if user with the same email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
        }
        return userRepository.save(user);
    }

        // Validate password strength
        validatePassword(signupRequest.getPassword());

        // Create new user
        User user = User.builder()
                .username(signupRequest.getUsername())
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(signupRequest.getRole() != null ? signupRequest.getRole() : Role.USER)
                .build();

        return userRepository.save(user);
    }

    /**
     * Validate password strength
     */
    private void validatePassword(String password) {
        if (password.length() < 8) {
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
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(profileDTO.getEmail()) && userRepository.existsByEmail(profileDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setName(profileDTO.getName());
        user.setEmail(profileDTO.getEmail());

        User updatedUser = userRepository.save(user);

        return UserProfileDTO.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole())
                .build();
    }

    @Transactional
    public UserProfileDTO updateUserProfile(Long id, UserProfileDTO profileDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(profileDTO.getEmail()) && userRepository.existsByEmail(profileDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setName(profileDTO.getName());
        user.setEmail(profileDTO.getEmail());

        User updatedUser = userRepository.save(user);

        return UserProfileDTO.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole())
                .build();
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        userRepository.delete(user);
    }
}