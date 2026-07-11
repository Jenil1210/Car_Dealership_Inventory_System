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

    @Test
    void addVehicle_shouldSaveAndReturnVehicle_whenValid() {
        Vehicle vehicle = Vehicle.builder()
                .make("BMW").model("X5").category("SUV")
                .price(new BigDecimal("60000")).quantity(2)
                .build();

        Vehicle saved = vehicleService.addVehicle(vehicle);

        assertNotNull(saved.getId());
        assertEquals("BMW", saved.getMake());
        assertEquals("X5", saved.getModel());
    }

    @Test
    void searchVehicles_shouldReturnMatchingVehicles_whenFilterApplied() {
        vehicleRepository.save(Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(5).build());
        vehicleRepository.save(Vehicle.builder()
                .make("Ford").model("F-150").category("Truck")
                .price(new BigDecimal("40000")).quantity(2).build());

        List<Vehicle> result = vehicleService.searchVehicles("Toyota", null, null, null, null);

        assertEquals(1, result.size());
        assertEquals("Toyota", result.get(0).getMake());
    }

    @Test
    void updateVehicle_shouldUpdateFields_whenVehicleExists() {
        Vehicle saved = vehicleRepository.save(Vehicle.builder()
                .make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("22000")).quantity(3).build());

        Vehicle updated = Vehicle.builder()
                .make("Honda").model("Accord").category("Sedan")
                .price(new BigDecimal("28000")).quantity(4).build();

        Vehicle result = vehicleService.updateVehicle(saved.getId(), updated);

        assertEquals("Accord", result.getModel());
        assertEquals(new BigDecimal("28000"), result.getPrice());
    }

    @Test
    void updateVehicle_shouldThrowException_whenVehicleNotFound() {
        Vehicle updated = Vehicle.builder()
                .make("Honda").model("Accord").category("Sedan")
                .price(new BigDecimal("28000")).quantity(4).build();

        assertThrows(IllegalArgumentException.class,
                () -> vehicleService.updateVehicle(java.util.UUID.randomUUID(), updated));
    }

    @Test
    void deleteVehicle_shouldRemoveVehicle_whenExists() {
        Vehicle saved = vehicleRepository.save(Vehicle.builder()
                .make("Ford").model("Mustang").category("Sports")
                .price(new BigDecimal("55000")).quantity(1).build());

        vehicleService.deleteVehicle(saved.getId());

        assertFalse(vehicleRepository.existsById(saved.getId()));
    }

    @Test
    void deleteVehicle_shouldThrowException_whenNotFound() {
        assertThrows(IllegalArgumentException.class,
                () -> vehicleService.deleteVehicle(java.util.UUID.randomUUID()));
    }

    // Sprint 61 RED: Purchase vehicle should reduce quantity when stock is sufficient
    @Test
    void purchaseVehicle_shouldReduceQuantity_whenStockIsAvailable() {
        Vehicle saved = vehicleRepository.save(Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(5).build());

        Vehicle result = vehicleService.purchaseVehicle(saved.getId(), 2);

        assertEquals(3, result.getQuantity());
        assertEquals(3, vehicleRepository.findById(saved.getId()).orElseThrow().getQuantity());
    }

    // Sprint 61 RED: Purchase vehicle should throw IllegalArgumentException when stock is insufficient
    @Test
    void purchaseVehicle_shouldThrowException_whenStockIsInsufficient() {
        Vehicle saved = vehicleRepository.save(Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(2).build());

        assertThrows(IllegalArgumentException.class,
                () -> vehicleService.purchaseVehicle(saved.getId(), 5));
    }

    // Sprint 61 RED: Restock vehicle should increase quantity
    @Test
    void restockVehicle_shouldIncreaseQuantity_whenCalled() {
        Vehicle saved = vehicleRepository.save(Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(2).build());

        Vehicle result = vehicleService.restockVehicle(saved.getId(), 10);

        assertEquals(12, result.getQuantity());
        assertEquals(12, vehicleRepository.findById(saved.getId()).orElseThrow().getQuantity());
    }
}
