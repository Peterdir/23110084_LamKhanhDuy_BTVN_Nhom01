package com.course.btvn_nhom1.repository;

import com.course.btvn_nhom1.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByIsFraudTrue();
}
