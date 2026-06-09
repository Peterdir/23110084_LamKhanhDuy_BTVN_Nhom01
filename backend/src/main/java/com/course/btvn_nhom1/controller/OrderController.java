package com.course.btvn_nhom1.controller;

import com.course.btvn_nhom1.dto.ApiResponse;
import com.course.btvn_nhom1.dto.OrderResponse;
import com.course.btvn_nhom1.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            Long buyerId = Long.valueOf(payload.get("buyerId").toString());
            Long productId = Long.valueOf(payload.get("productId").toString());
            String paymentMethod = payload.get("paymentMethod").toString();

            OrderResponse order = orderService.createOrder(buyerId, productId, paymentMethod);
            return ResponseEntity.ok(ApiResponse.ok(order, "Order created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
