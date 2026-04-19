package com.khalidbijoux.api.catalog;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "external_id", unique = true)
    private String externalId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "price", nullable = false)
    private Integer price;
    
    @Column(name = "original_price")
    private Integer originalPrice;
    
    @Column(name = "material")
    private String material;
    
    @Column(name = "tag")
    private String tag;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "image")
    private String image;
}
