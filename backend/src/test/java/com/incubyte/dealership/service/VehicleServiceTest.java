package com.incubyte.dealership.service;

import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: VehicleService tests written before implementation exists.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class VehicleServiceTest {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @BeforeEach
    void setUp() {
        vehicleRepository.deleteAll();
    }

    @Test
    void getAllVehicles_shouldReturnAllVehicles_whenVehiclesExist() {
        Vehicle v1 = Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(5)
                .build();
        Vehicle v2 = Vehicle.builder()
                .make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("22000")).quantity(3)
                .build();
        vehicleRepository.saveAll(List.of(v1, v2));

        List<Vehicle> result = vehicleService.getAllVehicles();

        assertEquals(2, result.size());
    }

    @Test
    void getAllVehicles_shouldReturnEmpty_whenNoVehiclesExist() {
        List<Vehicle> result = vehicleService.getAllVehicles();

        assertTrue(result.isEmpty());
    }
}
