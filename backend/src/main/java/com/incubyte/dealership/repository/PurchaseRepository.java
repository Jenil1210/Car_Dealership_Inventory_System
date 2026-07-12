package com.incubyte.dealership.repository;

import com.incubyte.dealership.model.Purchase;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Purchase Entity.
 */
@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
    List<Purchase> findByUserOrderByPurchaseDateDesc(User user);
    List<Purchase> findByUserAndVehicle(User user, Vehicle vehicle);
}
