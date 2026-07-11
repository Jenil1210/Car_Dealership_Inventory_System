package com.incubyte.dealership;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Verifies the Spring application context loads successfully.
 */
@SpringBootTest
@ActiveProfiles("test")
class DealershipApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the application context starts without errors
    }

}
