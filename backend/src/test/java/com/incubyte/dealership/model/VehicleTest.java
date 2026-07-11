package com.incubyte.dealership.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - RED phase: Test Vehicle class properties and constraints before it is created.
 */
class VehicleTest {

    @Test
    void vehicle_shouldStoreFieldsCorrectly() {
        UUID id = UUID.randomUUID();
        Vehicle vehicle = new Vehicle();
        vehicle.setId(id);
        vehicle.setMake("Toyota");
        vehicle.setModel("Camry");
        vehicle.setCategory("Sedan");
        vehicle.setPrice(new BigDecimal("25000.00"));
        vehicle.setQuantity(5);

        assertEquals(id, vehicle.getId());
        assertEquals("Toyota", vehicle.getMake());
        assertEquals("Camry", vehicle.getModel());
        assertEquals("Sedan", vehicle.getCategory());
        assertEquals(new BigDecimal("25000.00"), vehicle.getPrice());
        assertEquals(5, vehicle.getQuantity());
    }
}
