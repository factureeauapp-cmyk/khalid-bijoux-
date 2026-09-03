package com.khalidbijoux.api.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @Column(nullable = false)
    private Integer quantity = 0;

    /**
     * Caractéristiques dynamiques du produit.
     * Exemple :
     * Taille -> 6, 7, 8
     * Couleur -> Or, Argent
     */
    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private List<ProductAttribute> attributes = new ArrayList<>();

    public void replaceImages(List<String> imageUrls) {
        images.clear();

        for (int index = 0; index < imageUrls.size(); index++) {
            images.add(ProductImage.builder()
                    .product(this)
                    .imageUrl(imageUrls.get(index))
                    .displayOrder(index)
                    .build());
        }

        image = imageUrls.isEmpty()
                ? "/placeholder.svg"
                : imageUrls.get(0);
    }

    public void replaceAttributes(List<ProductAttribute> newAttributes) {
        attributes.clear();

        if (newAttributes == null) {
            return;
        }

        for (int index = 0; index < newAttributes.size(); index++) {
            ProductAttribute attribute = newAttributes.get(index);

            attribute.setProduct(this);
            attribute.setDisplayOrder(index);

            if (attribute.getValues() != null) {
                for (int valueIndex = 0;
                     valueIndex < attribute.getValues().size();
                     valueIndex++) {

                    ProductAttributeValue value =
                            attribute.getValues().get(valueIndex);

                    value.setAttribute(attribute);
                    value.setDisplayOrder(valueIndex);
                }
            }

            attributes.add(attribute);
        }
    }
}