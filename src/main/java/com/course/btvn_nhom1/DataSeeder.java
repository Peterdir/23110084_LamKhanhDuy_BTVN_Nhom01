package com.course.btvn_nhom1;

import com.course.btvn_nhom1.model.Product;
import com.course.btvn_nhom1.model.Seller;
import com.course.btvn_nhom1.model.User;
import com.course.btvn_nhom1.repository.ProductRepository;
import com.course.btvn_nhom1.repository.SellerRepository;
import com.course.btvn_nhom1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create Users
        User u1 = new User();
        u1.setName("Alice (Old User, Subscribed)");
        u1.setCreatedAt(LocalDateTime.now().minusDays(10));
        u1.setSubscription(true);
        userRepository.save(u1);

        User u2 = new User();
        u2.setName("Bob (New User, Fraud Test)");
        u2.setCreatedAt(LocalDateTime.now());
        u2.setSubscription(false);
        userRepository.save(u2);

        // Create Sellers
        Seller s1 = new Seller();
        s1.setName("Tech Store (Freemium)");
        s1.setType("FREEMIUM");
        sellerRepository.save(s1);

        Seller s2 = new Seller();
        s2.setName("Fashion Hub (Premium)");
        s2.setType("PREMIUM");
        sellerRepository.save(s2);

        // Create Products
        Product p1 = new Product();
        p1.setName("Smartphone X");
        p1.setPrice(15000000);
        p1.setSellerId(s1.getId());
        p1.setOrigin("DOMESTIC");
        p1.setCategory("Electronics");
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Wireless Earbuds");
        p2.setPrice(2000000);
        p2.setSellerId(s1.getId());
        p2.setOrigin("INTERNATIONAL");
        p2.setCategory("Electronics");
        productRepository.save(p2);

        Product p3 = new Product();
        p3.setName("Running Shoes");
        p3.setPrice(1500000);
        p3.setSellerId(s2.getId());
        p3.setOrigin("DOMESTIC");
        p3.setCategory("Fashion");
        productRepository.save(p3);

        Product p4 = new Product();
        p4.setName("T-Shirt");
        p4.setPrice(300000);
        p4.setSellerId(s2.getId());
        p4.setOrigin("DOMESTIC");
        p4.setCategory("Fashion");
        productRepository.save(p4);
        
        System.out.println("Sample data seeded successfully.");
    }
}
