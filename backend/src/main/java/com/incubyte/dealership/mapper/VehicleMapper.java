package com.incubyte.dealership.mapper;

import com.incubyte.dealership.dto.VehicleResponse;
import com.incubyte.dealership.model.Vehicle;

/**
 * Mapper utility to convert Vehicle entities to DTO responses.
 */
public class VehicleMapper {

    public static VehicleResponse toResponse(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .category(vehicle.getCategory())
                .price(vehicle.getPrice())
                .quantity(vehicle.getQuantity())
                .build();
    }
}
