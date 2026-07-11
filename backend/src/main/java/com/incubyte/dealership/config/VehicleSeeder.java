package com.incubyte.dealership.config;

import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds 10 different vehicles into the database on startup if no vehicles exist.
 */
@Component
public class VehicleSeeder implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;

    public VehicleSeeder(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (vehicleRepository.count() == 0) {
            List<Vehicle> initialVehicles = Arrays.asList(
                Vehicle.builder()
                    .make("Tesla")
                    .model("Model S")
                    .category("Electric")
                    .price(new BigDecimal("89990"))
                    .quantity(5)
                    .build(),
                Vehicle.builder()
                    .make("Tesla")
                    .model("Model 3")
                    .category("Electric")
                    .price(new BigDecimal("41990"))
                    .quantity(8)
                    .build(),
                Vehicle.builder()
                    .make("Ford")
                    .model("Mustang Mach-E")
                    .category("Electric")
                    .price(new BigDecimal("42995"))
                    .quantity(3)
                    .build(),
                Vehicle.builder()
                    .make("Porsche")
                    .model("Taycan")
                    .category("Electric")
                    .price(new BigDecimal("90900"))
                    .quantity(2)
                    .build(),
                Vehicle.builder()
                    .make("BMW")
                    .model("i4 M50")
                    .category("Electric")
                    .price(new BigDecimal("69700"))
                    .quantity(4)
                    .build(),
                Vehicle.builder()
                    .make("Toyota")
                    .model("RAV4 Hybrid")
                    .category("SUV")
                    .price(new BigDecimal("31475"))
                    .quantity(10)
                    .build(),
                Vehicle.builder()
                    .make("Ford")
                    .model("Explorer")
                    .category("SUV")
                    .price(new BigDecimal("36760"))
                    .quantity(6)
                    .build(),
                Vehicle.builder()
                    .make("BMW")
                    .model("X5")
                    .category("SUV")
                    .price(new BigDecimal("65200"))
                    .quantity(3)
                    .build(),
                Vehicle.builder()
                    .make("Honda")
                    .model("Civic")
                    .category("Sedan")
                    .price(new BigDecimal("23950"))
                    .quantity(12)
                    .build(),
                Vehicle.builder()
                    .make("Toyota")
                    .model("Camry")
                    .category("Sedan")
                    .price(new BigDecimal("26420"))
                    .quantity(9)
                    .build()
            );

            vehicleRepository.saveAll(initialVehicles);
        }
    }
}
