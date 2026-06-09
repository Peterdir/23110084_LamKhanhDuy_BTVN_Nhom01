package com.course.btvn_nhom1.service;

import com.course.btvn_nhom1.model.Order;
import com.course.btvn_nhom1.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getStats() {
        List<Order> orders = orderRepository.findAll();
        
        double totalCommission = orders.stream().mapToDouble(Order::getCommissionFee).sum();
        double totalBnplInterest = orders.stream().mapToDouble(Order::getBnplFee).sum();
        long totalFraudOrders = orders.stream().filter(Order::isFraud).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCommission", totalCommission);
        stats.put("totalBnplInterest", totalBnplInterest);
        stats.put("totalFraudOrders", totalFraudOrders);
        return stats;
    }

    public List<Order> getFraudOrders() {
        return orderRepository.findByIsFraudTrue();
    }

    public Order approveOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("APPROVED");
        order.setFraud(false);
        return orderRepository.save(order);
    }

    public Order rejectOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("REJECTED");
        return orderRepository.save(order);
    }
}
