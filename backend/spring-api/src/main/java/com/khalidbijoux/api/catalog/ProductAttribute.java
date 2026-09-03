package com.khalidbijoux.api.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_attributes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID public de l'attribut.
     * Exemple : ATTR-001
     */
    @Column(nullable = false, unique = true)
    private String attributeId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String nameAr;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_pk", nullable = false)
    private Product product;

    @OneToMany(
            mappedBy = "attribute",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private List<ProductAttributeValue> values = new ArrayList<>();
}