package com.incubyte.dealership.service;

import com.incubyte.dealership.model.Role;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - Sprint 54 RED: One failing test before UserService.getUserById exists.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void getUserById_shouldReturnUser_whenUserExists() {
        User saved = userRepository.save(User.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("hashedpassword")
                .role(Role.USER)
                .build());

        User found = userService.getUserById(saved.getId());

        assertNotNull(found);
        assertEquals("alice@example.com", found.getEmail());
    }

    // Sprint 56 RED: Failing test — user not found should throw exception
    @Test
    void getUserById_shouldThrowException_whenUserDoesNotExist() {
        assertThrows(IllegalArgumentException.class,
                () -> userService.getUserById(99999L));
    }

    // Sprint 57 RED: Failing test — deleteUserById removes user
    @Test
    void deleteUserById_shouldRemoveUser_whenUserExists() {
        User saved = userRepository.save(User.builder()
                .name("Bob")
                .email("bob@example.com")
                .password("hashedpassword")
                .role(Role.USER)
                .build());

        userService.deleteUserById(saved.getId());

        assertFalse(userRepository.existsById(saved.getId()));
    }
}
