package com.khalidbijoux.api.catalog;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_attribute_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttributeValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID public stable.
     * Exemple : ATTR-VALUE-001
     */
    @Column(nullable = false, unique = true)
    private String valueId;

    @Column(nullable = false, length = 150)
    private String value;

    @Column(length = 150)
    private String valueAr;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attribute_id", nullable = false)
    private ProductAttribute attribute;
}