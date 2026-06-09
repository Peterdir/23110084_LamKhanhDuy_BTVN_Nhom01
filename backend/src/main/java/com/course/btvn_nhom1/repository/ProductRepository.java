package com.course.btvn_nhom1.repository;

import com.course.btvn_nhom1.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryOrSellerId(String category, Long sellerId);
}
