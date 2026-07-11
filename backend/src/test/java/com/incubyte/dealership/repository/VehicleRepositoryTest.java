package com.incubyte.dealership.repository;

import com.incubyte.dealership.model.Vehicle;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: VehicleRepository search test written before repository exists.
 */
@DataJpaTest
@ActiveProfiles("test")
class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    void search_shouldReturnMatchingVehicles_whenFilteredByMake() {
        Vehicle v1 = Vehicle.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(5)
                .build();
        Vehicle v2 = Vehicle.builder()
                .make("Honda")
                .model("Civic")
                .category("Sedan")
                .price(new BigDecimal("22000.00"))
                .quantity(3)
                .build();
        vehicleRepository.save(v1);
        vehicleRepository.save(v2);

        List<Vehicle> found = vehicleRepository.search("Toyota", null, null, null, null);

        assertEquals(1, found.size());
        assertEquals("Toyota", found.get(0).getMake());
    }

    @Test
    void search_shouldReturnMatchingVehicles_whenFilteredByModel() {
        Vehicle v = Vehicle.builder()
                .make("Honda")
                .model("Civic")
                .category("Sedan")
                .price(new BigDecimal("22000.00"))
                .quantity(3)
                .build();
        vehicleRepository.save(v);

        List<Vehicle> found = vehicleRepository.search(null, "Civic", null, null, null);

        assertEquals(1, found.size());
        assertEquals("Civic", found.get(0).getModel());
    }

    @Test
    void search_shouldReturnMatchingVehicles_whenFilteredByCategory() {
        Vehicle v = Vehicle.builder()
                .make("Toyota")
                .model("RAV4")
                .category("SUV")
                .price(new BigDecimal("30000.00"))
                .quantity(2)
                .build();
        vehicleRepository.save(v);

        List<Vehicle> found = vehicleRepository.search(null, null, "SUV", null, null);

        assertEquals(1, found.size());
        assertEquals("SUV", found.get(0).getCategory());
    }

    @Test
    void search_shouldReturnMatchingVehicles_whenFilteredByPriceRange() {
        Vehicle v1 = Vehicle.builder()
                .make("Toyota")
                .model("Yaris")
                .category("Hatchback")
                .price(new BigDecimal("15000.00"))
                .quantity(1)
                .build();
        Vehicle v2 = Vehicle.builder()
                .make("Toyota")
                .model("Corolla")
                .category("Sedan")
                .price(new BigDecimal("20000.00"))
                .quantity(2)
                .build();
        Vehicle v3 = Vehicle.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("28000.00"))
                .quantity(3)
                .build();
        vehicleRepository.save(v1);
        vehicleRepository.save(v2);
        vehicleRepository.save(v3);

        List<Vehicle> found = vehicleRepository.search(null, null, null, new BigDecimal("18000.00"), new BigDecimal("25000.00"));

        assertEquals(1, found.size());
        assertEquals("Corolla", found.get(0).getModel());
    }
}
