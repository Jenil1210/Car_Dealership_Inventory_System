package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.AuthResponse;
import com.incubyte.dealership.dto.LoginRequest;
import com.incubyte.dealership.dto.RegisterRequest;
import com.incubyte.dealership.model.Role;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: AuthService tests written before implementation exists.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_shouldSaveUserAndReturnToken_whenRequestIsValid() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Bob")
                .email("bob@example.com")
                .password("Password@123")
                .role(Role.USER)
                .build();

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(Role.USER, response.getRole());

        User savedUser = userRepository.findByEmail("bob@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("Bob", savedUser.getName());
        assertTrue(passwordEncoder.matches("Password@123", savedUser.getPassword()));
    }

    @Test
    void register_shouldThrowIllegalArgumentException_whenEmailIsAlreadyTaken() {
        // Pre-saving a user
        User existingUser = User.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("password")
                .role(Role.USER)
                .build();
        userRepository.save(existingUser);

        RegisterRequest request = RegisterRequest.builder()
                .name("New Alice")
                .email("alice@example.com")
                .password("Password@123")
                .role(Role.USER)
                .build();

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnJwtToken_whenCredentialsAreValid() {
        // Pre-register a user first
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Charlie")
                .email("charlie@example.com")
                .password("Password@123")
                .role(Role.USER)
                .build();
        authService.register(registerRequest);

        LoginRequest loginRequest = LoginRequest.builder()
                .email("charlie@example.com")
                .password("Password@123")
                .build();

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(Role.USER, response.getRole());
    }

    @Test
    void login_shouldThrowIllegalArgumentException_whenPasswordIsWrong() {
        // Pre-register a user first
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Dave")
                .email("dave@example.com")
                .password("Password@123")
                .role(Role.USER)
                .build();
        authService.register(registerRequest);

        LoginRequest loginRequest = LoginRequest.builder()
                .email("dave@example.com")
                .password("WrongPassword!")
                .build();

        assertThrows(IllegalArgumentException.class, () -> authService.login(loginRequest));
    }
}
