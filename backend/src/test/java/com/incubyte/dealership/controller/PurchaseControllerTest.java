package com.incubyte.dealership.controller;

import com.incubyte.dealership.model.Purchase;
import com.incubyte.dealership.model.Role;
import com.incubyte.dealership.model.User;
import com.incubyte.dealership.repository.UserRepository;
import com.incubyte.dealership.repository.PurchaseRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PurchaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PurchaseRepository purchaseRepository;

    @MockBean
    private UserRepository userRepository;

    @Test
    @WithMockUser(username = "user@example.com", roles = "USER")
    void getMyPurchases_shouldReturn200AndPurchasesList_whenAuthenticated() throws Exception {
        User user = User.builder()
                .id(1L)
                .email("user@example.com")
                .name("Alice")
                .role(Role.USER)
                .build();

        Purchase purchase = Purchase.builder()
                .id(UUID.randomUUID())
                .user(user)
                .make("Tesla")
                .model("Model 3")
                .category("Electric")
                .price(new BigDecimal("45000.00"))
                .quantity(1)
                .purchaseDate(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(purchaseRepository.findByUserOrderByPurchaseDateDesc(user)).thenReturn(Collections.singletonList(purchase));

        mockMvc.perform(get("/api/purchases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].make").value("Tesla"))
                .andExpect(jsonPath("$[0].model").value("Model 3"))
                .andExpect(jsonPath("$[0].price").value(45000.00))
                .andExpect(jsonPath("$[0].quantity").value(1));

        verify(userRepository).findByEmail("user@example.com");
        verify(purchaseRepository).findByUserOrderByPurchaseDateDesc(user);
    }

    @Test
    void getMyPurchases_shouldReturn403_whenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/purchases"))
                .andExpect(status().isForbidden());
    }
}
