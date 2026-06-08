package com.course.btvn_nhom1.controller;

import com.course.btvn_nhom1.model.Product;
import com.course.btvn_nhom1.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}/similar")
    public List<Product> getSimilarProducts(@PathVariable Long id) {
        return productService.getSimilarProducts(id);
    }
}
