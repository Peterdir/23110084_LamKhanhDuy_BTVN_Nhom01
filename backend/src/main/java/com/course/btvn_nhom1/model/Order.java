package com.course.btvn_nhom1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long buyerId;

    private Long sellerId;

    private Long productId;

    private double originalPrice;

    private double shippingFee;

    private double commissionFee;

    private double taxFee;

    private double bnplFee;

    private double totalPrice;

    private String paymentMethod; // COD, CARD, BNPL

    private boolean isFraud;

    private String status; // PENDING, APPROVED, REJECTED
}
