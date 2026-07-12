package com.incubyte.dealership.controller;

import com.incubyte.dealership.dto.PurchaseResponse;
import com.incubyte.dealership.mapper.PurchaseMapper;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.repository.UserRepository;
import com.incubyte.dealership.repository.PurchaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller handling user purchase history endpoints.
 */
@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;

    public PurchaseController(PurchaseRepository purchaseRepository, UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the purchase history of the currently authenticated user.
     * Accessible by any authenticated user.
     *
     * @return List of PurchaseResponse DTOs
     */
    @GetMapping
    public ResponseEntity<List<PurchaseResponse>> getMyPurchases() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        List<PurchaseResponse> responses = PurchaseMapper.toResponseList(
                purchaseRepository.findByUserOrderByPurchaseDateDesc(user)
        );
        return ResponseEntity.ok(responses);
    }
}
