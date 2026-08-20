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

    /** First image stays denormalized for compatibility with older clients. */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @Column(nullable = false)
    private Integer quantity = 0;

    public void replaceImages(List<String> imageUrls) {
        images.clear();
        for (int index = 0; index < imageUrls.size(); index++) {
            images.add(ProductImage.builder()
                    .product(this)
                    .imageUrl(imageUrls.get(index))
                    .displayOrder(index)
                    .build());
        }
        image = imageUrls.isEmpty() ? "/placeholder.svg" : imageUrls.get(0);
    }
}
