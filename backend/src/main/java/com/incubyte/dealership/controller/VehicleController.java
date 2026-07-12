package com.incubyte.dealership.controller;

import com.incubyte.dealership.dto.VehicleResponse;
import com.incubyte.dealership.mapper.VehicleMapper;
import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Controller handling vehicle inventory CRUD API endpoints.
 */
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /**
     * Retrieves all vehicles from the inventory.
     * Accessible by any authenticated user.
     *
     * @return List of VehicleResponse DTOs
     */
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        List<VehicleResponse> responses = vehicleService.getAllVehicles().stream()
                .map(VehicleMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Searches vehicles with optional query parameters.
     * Accessible by any authenticated user.
     *
     * @param make Optional manufacturer filter
     * @param model Optional model filter
     * @param category Optional category filter
     * @param minPrice Optional minimum price filter
     * @param maxPrice Optional maximum price filter
     * @return List of filtered VehicleResponse DTOs
     */
    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<VehicleResponse> responses = vehicleService.searchVehicles(make, model, category, minPrice, maxPrice).stream()
                .map(VehicleMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Adds a new vehicle to the inventory.
     * Restricted to ADMIN role only.
     *
     * @param vehicle The vehicle details to save
     * @return Saved VehicleResponse DTO
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> addVehicle(@Valid @RequestBody Vehicle vehicle) {
        VehicleResponse response = VehicleMapper.toResponse(vehicleService.addVehicle(vehicle));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing vehicle's details.
     * Restricted to ADMIN role only.
     *
     * @param id The UUID of the vehicle to update
     * @param vehicle The new vehicle details
     * @return Updated VehicleResponse DTO
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable UUID id, @Valid @RequestBody Vehicle vehicle) {
        VehicleResponse response = VehicleMapper.toResponse(vehicleService.updateVehicle(id, vehicle));
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a vehicle from the inventory.
     * Restricted to ADMIN role only.
     *
     * @param id The UUID of the vehicle to delete
     * @return 204 No Content response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Processes a vehicle purchase by decreasing its stock.
     * Accessible by any authenticated user.
     *
     * @param id The UUID of the vehicle to purchase
     * @param quantity The amount to purchase
     * @return Updated VehicleResponse DTO
     */
    @PostMapping("/{id}/purchase")
    public ResponseEntity<VehicleResponse> purchaseVehicle(@PathVariable UUID id, @RequestParam int quantity) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        VehicleResponse response = VehicleMapper.toResponse(vehicleService.purchaseVehicle(id, quantity, email));
        return ResponseEntity.ok(response);
    }

    /**
     * Processes a vehicle restocking by increasing its stock.
     * Restricted to ADMIN role only.
     *
     * @param id The UUID of the vehicle to restock
     * @param quantity The amount to add to inventory
     * @return Updated VehicleResponse DTO
     */
    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> restockVehicle(@PathVariable UUID id, @RequestParam int quantity) {
        VehicleResponse response = VehicleMapper.toResponse(vehicleService.restockVehicle(id, quantity));
        return ResponseEntity.ok(response);
    }
}
