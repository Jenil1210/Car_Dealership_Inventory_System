package com.incubyte.dealership.config;

import com.incubyte.dealership.model.Role;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - Sprint 87 RED: Test that default admin user is seeded on startup.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AdminUserSeederTest {

    @Autowired
    private UserRepository userRepository;

    @Value("${admin.email:admin@dealership.com}")
    private String adminEmail;

    @Value("${admin.name:System Admin}")
    private String adminName;

    @Test
    void seeder_shouldCreateAdminUser_onStartup() {
        Optional<User> admin = userRepository.findByEmail(adminEmail);
        assertTrue(admin.isPresent(), "Admin user should be seeded on startup");
        assertEquals(adminName, admin.get().getName());
        assertEquals(Role.ADMIN, admin.get().getRole());
    }
}
