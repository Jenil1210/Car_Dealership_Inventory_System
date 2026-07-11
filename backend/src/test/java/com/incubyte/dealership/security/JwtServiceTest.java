package com.incubyte.dealership.security;

import com.incubyte.dealership.model.Role;
import com.incubyte.dealership.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: JwtService test written before JwtService class exists.
 */
@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateToken_shouldReturnNonNullString() {
        User user = User.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        String token = jwtService.generateToken(user);
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void extractUsername_shouldReturnCorrectEmail() {
        User user = User.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        String token = jwtService.generateToken(user);
        String email = jwtService.extractUsername(token);
        assertEquals("alice@example.com", email);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        User user = User.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        String token = jwtService.generateToken(user);

        // Custom minimal user details implementation for testing validation
        org.springframework.security.core.userdetails.UserDetails userDetails = 
            org.springframework.security.core.userdetails.User.withUsername("alice@example.com")
                .password("password")
                .roles("USER")
                .build();

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }
}
