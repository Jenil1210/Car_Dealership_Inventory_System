package com.incubyte.dealership.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.dealership.model.Vehicle;
import com.incubyte.dealership.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TDD - RED phase: VehicleController tests written before implementation exists.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    @Test
    @WithMockUser(roles = "USER")
    void getAllVehicles_shouldReturn200AndList_whenCalled() throws Exception {
        Vehicle v = Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(5)
                .build();

        when(vehicleService.getAllVehicles()).thenReturn(List.of(v));

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].model").value("Camry"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addVehicle_shouldReturn201AndSavedVehicle_whenValid() throws Exception {
        Vehicle vehicle = Vehicle.builder()
                .make("BMW").model("X5").category("SUV")
                .price(new BigDecimal("60000")).quantity(2)
                .build();
        Vehicle saved = Vehicle.builder()
                .make("BMW").model("X5").category("SUV")
                .price(new BigDecimal("60000")).quantity(2)
                .build();

        when(vehicleService.addVehicle(any(Vehicle.class))).thenReturn(saved);

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicle)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value("BMW"))
                .andExpect(jsonPath("$.model").value("X5"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateVehicle_shouldReturn200AndUpdatedVehicle_whenExists() throws Exception {
        UUID id = UUID.randomUUID();
        Vehicle updated = Vehicle.builder()
                .make("Honda").model("Accord").category("Sedan")
                .price(new BigDecimal("28000")).quantity(4)
                .build();

        when(vehicleService.updateVehicle(eq(id), any(Vehicle.class))).thenReturn(updated);

        mockMvc.perform(put("/api/vehicles/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("Accord"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteVehicle_shouldReturn204_whenExists() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(vehicleService).deleteVehicle(id);

        mockMvc.perform(delete("/api/vehicles/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void getAllVehicles_shouldReturn403_whenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isForbidden());
    }

    // Sprint 61 RED: Integration test for GET /api/vehicles/search - authenticated user should get 200 and search results
    @Test
    @WithMockUser(roles = "USER")
    void searchVehicles_shouldReturn200AndList_whenAuthenticated() throws Exception {
        Vehicle v = Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(5)
                .build();

        when(vehicleService.searchVehicles("Toyota", null, null, null, null))
                .thenReturn(List.of(v));

        mockMvc.perform(get("/api/vehicles/search?make=Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].model").value("Camry"));
    }

    // Sprint 61 RED: Integration test for GET /api/vehicles/search - unauthenticated user should get 403 Forbidden
    @Test
    void searchVehicles_shouldReturn403_whenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/vehicles/search?make=Toyota"))
                .andExpect(status().isForbidden());
    }

    // Sprint 61 RED: Integration test for POST /api/vehicles/{id}/purchase - authenticated user should get 200 and updated vehicle
    @Test
    @WithMockUser(roles = "USER")
    void purchaseVehicle_shouldReturn200AndUpdatedResponse_whenAuthenticated() throws Exception {
        UUID id = UUID.randomUUID();
        Vehicle updated = Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(3)
                .build();

        when(vehicleService.purchaseVehicle(eq(id), eq(2), any())).thenReturn(updated);

        mockMvc.perform(post("/api/vehicles/" + id + "/purchase?quantity=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(3));
    }

    // Sprint 61 RED: Integration test for POST /api/vehicles/{id}/purchase - unauthenticated user should get 403 Forbidden
    @Test
    void purchaseVehicle_shouldReturn403_whenUnauthenticated() throws Exception {
        UUID id = UUID.randomUUID();
        mockMvc.perform(post("/api/vehicles/" + id + "/purchase?quantity=2"))
                .andExpect(status().isForbidden());
    }

    // Sprint 61 RED: Integration test for POST /api/vehicles/{id}/restock - admin user should get 200 and updated vehicle
    @Test
    @WithMockUser(roles = "ADMIN")
    void restockVehicle_shouldReturn200AndUpdatedResponse_whenAdmin() throws Exception {
        UUID id = UUID.randomUUID();
        Vehicle updated = Vehicle.builder()
                .make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000")).quantity(12)
                .build();

        when(vehicleService.restockVehicle(id, 10)).thenReturn(updated);

        mockMvc.perform(post("/api/vehicles/" + id + "/restock?quantity=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(12));
    }

    // Sprint 61 RED: Integration test for POST /api/vehicles/{id}/restock - non-admin user should get 403 Forbidden
    @Test
    @WithMockUser(roles = "USER")
    void restockVehicle_shouldReturn403_whenNotAdmin() throws Exception {
        UUID id = UUID.randomUUID();
        mockMvc.perform(post("/api/vehicles/" + id + "/restock?quantity=10"))
                .andExpect(status().isForbidden());
    }
}
