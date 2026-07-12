package com.incubyte.dealership.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to check backend connectivity and status.
 */
@RestController
@RequestMapping("/api/hello")
public class HelloController {

    @GetMapping
    public Map<String, String> sayHello() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Hello! The Car Dealership Inventory System backend is running successfully.");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return status;
    }
}
