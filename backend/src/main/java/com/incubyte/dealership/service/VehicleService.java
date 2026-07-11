package com.incubyte.dealership.service;

import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Service to handle vehicle inventory operations.
 */
@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> searchVehicles(String make, String model, String category,
                                        BigDecimal minPrice, BigDecimal maxPrice) {
        return vehicleRepository.search(make, model, category, minPrice, maxPrice);
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(UUID id, Vehicle updated) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + id));
        existing.setMake(updated.getMake());
        existing.setModel(updated.getModel());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setQuantity(updated.getQuantity());
        return vehicleRepository.save(existing);
    }

    public void deleteVehicle(UUID id) {
        if (!vehicleRepository.existsById(id)) {
            throw new IllegalArgumentException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }
}
