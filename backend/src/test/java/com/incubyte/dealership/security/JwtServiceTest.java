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
}
