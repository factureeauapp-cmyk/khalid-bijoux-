package com.khalidbijoux.api.catalog;

import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .nameFr(product.getNameFr())
                .nameAr(product.getNameAr())
                .descriptionFr(product.getDescriptionFr())
                .descriptionAr(product.getDescriptionAr())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .tag(product.getTag())
                .image(product.getImage())
                .images(product.getImages().stream()
                        .map(image -> new ProductImageResponse(image.getId(), image.getImageUrl(), image.getDisplayOrder()))
                        .toList())
                .quantity(product.getQuantity())
                .category(product.getCategory() != null
                        ? CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .nameFr(product.getCategory().getNameFr())
                        .nameAr(product.getCategory().getNameAr())
                        .build()
                        : null)
                .build();
    }

    public void applyUpsertRequest(Product product, ProductUpsertRequest request, Category category) {
        product.setNameFr(request.nameFr());
        product.setNameAr(request.nameAr());
        product.setDescriptionFr(request.descriptionFr());
        product.setDescriptionAr(request.descriptionAr());
        product.setCategory(category);
        product.setPrice(request.price());
        product.setOriginalPrice(request.originalPrice());
        product.setTag(request.tag());
        product.setQuantity(request.quantity());
        product.replaceImages(request.imageUrls());
    }

    public void applyCreateRequest(Product product, CreateProductRequest request, Category category) {
        product.setNameFr(request.getNameFr());
        product.setNameAr(request.getNameAr());
        product.setDescriptionFr(request.getDescriptionFr());
        product.setDescriptionAr(request.getDescriptionAr());
        product.setCategory(category);
        product.setPrice(request.getPrice() != null ? request.getPrice() : 0);
        product.setOriginalPrice(request.getOriginalPrice());
        product.setTag(request.getTag());
        product.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
    }
}
