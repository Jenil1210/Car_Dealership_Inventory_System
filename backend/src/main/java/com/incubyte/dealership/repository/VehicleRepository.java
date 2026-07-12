package com.incubyte.dealership.repository;

import com.incubyte.dealership.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Vehicle Entity.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    @Query("SELECT v FROM Vehicle v WHERE " +
            "(:make IS NULL OR LOWER(v.make) LIKE LOWER(CONCAT('%', CAST(:make AS string), '%'))) AND " +
            "(:model IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT(CAST(:model AS string), '%'))) AND " +
            "(:category IS NULL OR LOWER(v.category) LIKE LOWER(CONCAT('%', CAST(:category AS string), '%'))) AND " +
            "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR v.price <= :maxPrice)")
    List<Vehicle> search(
            @Param("make") String make,
            @Param("model") String model,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    java.util.Optional<Vehicle> findByIdForWrite(@Param("id") java.util.UUID id);
}
