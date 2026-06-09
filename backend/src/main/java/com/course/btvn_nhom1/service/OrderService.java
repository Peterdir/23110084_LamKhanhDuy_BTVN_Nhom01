package com.course.btvn_nhom1.service;

import com.course.btvn_nhom1.dto.OrderResponse;
import com.course.btvn_nhom1.model.Order;
import com.course.btvn_nhom1.model.Product;
import com.course.btvn_nhom1.model.Seller;
import com.course.btvn_nhom1.model.User;
import com.course.btvn_nhom1.repository.OrderRepository;
import com.course.btvn_nhom1.repository.ProductRepository;
import com.course.btvn_nhom1.repository.SellerRepository;
import com.course.btvn_nhom1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ProductRepository productRepository;

    public OrderResponse createOrder(Long buyerId, Long productId, String paymentMethod) {
        User buyer = userRepository.findById(buyerId).orElseThrow(() -> new RuntimeException("Buyer not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        Seller seller = sellerRepository.findById(product.getSellerId()).orElseThrow(() -> new RuntimeException("Seller not found"));

        Order order = new Order();
        order.setBuyerId(buyer.getId());
        order.setSellerId(seller.getId());
        order.setProductId(product.getId());
        order.setOriginalPrice(product.getPrice());
        order.setPaymentMethod(paymentMethod);
        order.setStatus("PENDING");

        // 1. Marketplace Commission
        double commissionRate = "PREMIUM".equalsIgnoreCase(seller.getType()) ? 0.02 : 0.05;
        order.setCommissionFee(product.getPrice() * commissionRate);

        // 2. Cross-border Tax
        int estimatedDeliveryDays;
        if ("INTERNATIONAL".equalsIgnoreCase(product.getOrigin())) {
            order.setTaxFee(product.getPrice() * 0.10);
            estimatedDeliveryDays = 10;
        } else {
            order.setTaxFee(0);
            estimatedDeliveryDays = 2;
        }

        // 3. LaaS - Shipping Fee
        if (buyer.isSubscription()) {
            order.setShippingFee(0);
        } else {
            order.setShippingFee(30000);
        }

        // 4. Fintech BNPL
        if ("bnpl".equalsIgnoreCase(paymentMethod)) {
            order.setBnplFee(product.getPrice() * 0.03);
        } else {
            order.setBnplFee(0);
        }

        // Calculate total price
        double totalPrice = order.getOriginalPrice() + order.getShippingFee() + order.getTaxFee() + order.getBnplFee();
        order.setTotalPrice(totalPrice);

        // BNPL Limit check
        if ("bnpl".equalsIgnoreCase(paymentMethod) && totalPrice > buyer.getBnplLimit()) {
            throw new RuntimeException("BNPL Limit Exceeded! Your limit is " + (long) buyer.getBnplLimit() + "đ but the total is " + (long) totalPrice + "đ");
        }

        // 5. Rule-based Fraud Check (Account created < 1 day)
        long daysBetween = ChronoUnit.DAYS.between(buyer.getCreatedAt(), LocalDateTime.now());
        if (daysBetween < 1) {
            order.setFraud(true);
        } else {
            order.setFraud(false);
        }

        Order savedOrder = orderRepository.save(order);

        return OrderResponse.from(savedOrder, buyer.getName(), seller.getName(), product.getName(), estimatedDeliveryDays);
    }
}
