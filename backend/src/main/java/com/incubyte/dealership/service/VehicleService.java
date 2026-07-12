package com.incubyte.dealership.service;

import com.incubyte.dealership.model.Purchase;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.repository.PurchaseRepository;
import com.incubyte.dealership.repository.UserRepository;
import com.incubyte.dealership.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service to handle vehicle inventory operations.
 */
@Service
public class VehicleService {

    @org.springframework.beans.factory.annotation.Value("${admin.email:admin@dealership.com}")
    private String adminEmail;

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final PurchaseRepository purchaseRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository, PurchaseRepository purchaseRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.purchaseRepository = purchaseRepository;
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

    @Transactional
    public synchronized Vehicle purchaseVehicle(UUID id, int quantity) {
        return purchaseVehicle(id, quantity, adminEmail);
    }

    @Transactional
    public synchronized Vehicle purchaseVehicle(UUID id, int quantity, String email) {
        Vehicle vehicle = vehicleRepository.findByIdForWrite(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + id));
        if (vehicle.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for vehicle: " + id);
        }

        User user = userRepository.findByEmail(email != null ? email : adminEmail)
                .orElseGet(() -> userRepository.findByEmail(adminEmail)
                        .orElseGet(() -> {
                            User fallbackAdmin = User.builder()
                                    .email(adminEmail)
                                    .name("System Admin")
                                    .password("dummy")
                                    .role(com.incubyte.dealership.model.Role.ADMIN)
                                    .build();
                            return userRepository.save(fallbackAdmin);
                        }));

        vehicle.setQuantity(vehicle.getQuantity() - quantity);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Always create a new purchase record for each buy (with its own date + quantity)
        Purchase purchase = Purchase.builder()
                .user(user)
                .vehicle(savedVehicle)
                .make(savedVehicle.getMake())
                .model(savedVehicle.getModel())
                .category(savedVehicle.getCategory())
                .price(savedVehicle.getPrice())
                .quantity(quantity)
                .purchaseDate(LocalDateTime.now())
                .build();
        purchaseRepository.save(purchase);

        return savedVehicle;
    }

    public Vehicle restockVehicle(UUID id, int quantity) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + id));
        vehicle.setQuantity(vehicle.getQuantity() + quantity);
        return vehicleRepository.save(vehicle);
    }
}
