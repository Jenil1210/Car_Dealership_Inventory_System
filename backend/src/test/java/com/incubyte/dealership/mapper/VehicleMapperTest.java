package com.incubyte.dealership.mapper;

import com.incubyte.dealership.dto.VehicleResponse;
import com.incubyte.dealership.model.Vehicle;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD - Sprint 58 RED: Test for mapping Vehicle to VehicleResponse.
 */
class VehicleMapperTest {

    @Test
    void toResponse_shouldMapAllFieldsCorrectly() {
        UUID id = UUID.randomUUID();
        Vehicle vehicle = Vehicle.builder()
                .id(id)
                .make("Toyota")
                .model("Corolla")
                .category("Sedan")
                .price(new BigDecimal("20000"))
                .quantity(10)
                .build();

        VehicleResponse response = VehicleMapper.toResponse(vehicle);

        assertNotNull(response);
        assertEquals(id, response.getId());
        assertEquals("Toyota", response.getMake());
        assertEquals("Corolla", response.getModel());
        assertEquals("Sedan", response.getCategory());
        assertEquals(new BigDecimal("20000"), response.getPrice());
        assertEquals(10, response.getQuantity());
    }
}
