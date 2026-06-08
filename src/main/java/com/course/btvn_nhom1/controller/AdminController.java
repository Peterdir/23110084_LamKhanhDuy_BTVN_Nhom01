package com.course.btvn_nhom1.controller;

import com.course.btvn_nhom1.model.Order;
import com.course.btvn_nhom1.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getStats();
    }

    @GetMapping("/fraud-orders")
    public List<Order> getFraudOrders() {
        return adminService.getFraudOrders();
    }

    @PostMapping("/orders/{id}/approve")
    public Order approveOrder(@PathVariable Long id) {
        return adminService.approveOrder(id);
    }

    @PostMapping("/orders/{id}/reject")
    public Order rejectOrder(@PathVariable Long id) {
        return adminService.rejectOrder(id);
    }
}
