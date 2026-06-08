package com.course.btvn_nhom1.service;

import com.course.btvn_nhom1.model.Product;
import com.course.btvn_nhom1.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getSimilarProducts(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            // Get by same category or same seller, excluding itself
            return productRepository.findByCategoryOrSellerId(product.getCategory(), product.getSellerId())
                    .stream()
                    .filter(p -> !p.getId().equals(productId))
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
