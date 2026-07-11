package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.AuthResponse;
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
}
