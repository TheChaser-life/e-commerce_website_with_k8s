package com.example.orderservice;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String productIds; // Simple string for demo
    private Double total;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getProductIds() { return productIds; }
    public void setProductIds(String productIds) { this.productIds = productIds; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}