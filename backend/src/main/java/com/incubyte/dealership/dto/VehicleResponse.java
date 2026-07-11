package com.incubyte.dealership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO representing vehicle information sent to clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private UUID id;
    private String make;
    private String model;
    private String category;
    private BigDecimal price;
    private int quantity;
}
