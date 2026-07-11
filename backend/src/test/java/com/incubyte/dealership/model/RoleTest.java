package com.incubyte.dealership.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: Test Role enum before implementation exists.
 */
class RoleTest {

    @Test
    void role_shouldHaveUserValue() {
        Role role = Role.USER;
        assertNotNull(role);
        assertEquals("USER", role.name());
    }

    @Test
    void role_shouldHaveAdminValue() {
        Role role = Role.ADMIN;
        assertNotNull(role);
        assertEquals("ADMIN", role.name());
    }

    @Test
    void role_shouldHaveExactlyTwoValues() {
        Role[] roles = Role.values();
        assertEquals(2, roles.length, "Role enum should have exactly USER and ADMIN");
    }
}
