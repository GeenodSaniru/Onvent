package ac.nsbm.onvent.newsystem.controller;

import ac.nsbm.onvent.newsystem.dto.AuthResponse;
import ac.nsbm.onvent.newsystem.dto.SignupRequest;
import ac.nsbm.onvent.newsystem.entity.Role;
import ac.nsbm.onvent.newsystem.entity.User;
import ac.nsbm.onvent.newsystem.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSignup_Success() throws Exception {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setName("Test User");
        signupRequest.setPassword("Test1234");

        User user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .name("Test User")
                .password("encodedPassword")
                .role(Role.USER)
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .name("Test User")
                .role(Role.USER)
                .message("User registered successfully")
                .build();

        when(userService.registerUser(any(SignupRequest.class))).thenReturn(user);
        when(userService.convertToAuthResponse(any(User.class), any(String.class))).thenReturn(authResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void testSignup_ValidationErrors() throws Exception {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername(""); // Invalid - required
        signupRequest.setEmail("invalid-email"); // Invalid format
        signupRequest.setName(""); // Invalid - required
        signupRequest.setPassword("123"); // Invalid - too short

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }
}