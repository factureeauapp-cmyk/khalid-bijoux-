package com.khalidbijoux.api.catalog;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pk;

    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private String nameFr;

    @Column(nullable = false)
    private String nameAr;

    @Column(length = 2000)
    private String descriptionFr;

    @Column(length = 2000)
    private String descriptionAr;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer price;

    private Integer originalPrice;

    private String tag;

    @Column(nullable = false)
    private String image;
}