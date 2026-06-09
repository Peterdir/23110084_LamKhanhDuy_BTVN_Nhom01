package com.course.btvn_nhom1.dto;

import com.course.btvn_nhom1.model.Order;
import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private Long sellerId;
    private String sellerName;
    private Long productId;
    private String productName;
    private double originalPrice;
    private double shippingFee;
    private double commissionFee;
    private double taxFee;
    private double bnplFee;
    private double totalPrice;
    private String paymentMethod;
    private boolean isFraud;
    private String status;
    private int estimatedDeliveryDays;

    public static OrderResponse from(Order order, String buyerName, String sellerName, String productName, int estimatedDeliveryDays) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setBuyerId(order.getBuyerId());
        dto.setBuyerName(buyerName);
        dto.setSellerId(order.getSellerId());
        dto.setSellerName(sellerName);
        dto.setProductId(order.getProductId());
        dto.setProductName(productName);
        dto.setOriginalPrice(order.getOriginalPrice());
        dto.setShippingFee(order.getShippingFee());
        dto.setCommissionFee(order.getCommissionFee());
        dto.setTaxFee(order.getTaxFee());
        dto.setBnplFee(order.getBnplFee());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setFraud(order.isFraud());
        dto.setStatus(order.getStatus());
        dto.setEstimatedDeliveryDays(estimatedDeliveryDays);
        return dto;
    }
}
