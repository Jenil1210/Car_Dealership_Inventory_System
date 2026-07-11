package com.incubyte.dealership.model;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: Test User class fields and mapping before User entity exists.
 */
class UserTest {

    @Test
    void user_shouldStoreFieldsCorrectly() {
        // Asserting properties of User class. This will fail compilation initially.
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("hashedpassword");
        user.setRole(Role.USER);

        assertEquals(1L, user.getId());
        assertEquals("John Doe", user.getName());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("hashedpassword", user.getPassword());
        assertEquals(Role.USER, user.getRole());
    }
}
