package com.khalidbijoux.api.catalog;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class ProductMapper {

    /**
     * ============================================================
     * PRODUCT ENTITY -> PRODUCT RESPONSE
     * ============================================================
     */
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

                .images(product.getImages() != null
                        ? product.getImages()
                        .stream()
                        .map(image ->
                                new ProductImageResponse(
                                        image.getId(),
                                        image.getImageUrl(),
                                        image.getDisplayOrder()
                                )
                        )
                        .toList()
                        : List.of())

                .quantity(product.getQuantity())

                .category(product.getCategory() != null
                        ? CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .nameFr(product.getCategory().getNameFr())
                        .nameAr(product.getCategory().getNameAr())
                        .build()
                        : null)

                // ================================================
                // ATTRIBUTES
                // ================================================
                .attributes(mapAttributes(product.getAttributes()))

                .build();
    }


    /**
     * ============================================================
     * UPSERT REQUEST -> PRODUCT ENTITY
     * ============================================================
     */
    public void applyUpsertRequest(
            Product product,
            ProductUpsertRequest request,
            Category category
    ) {
        product.setNameFr(request.nameFr());
        product.setNameAr(request.nameAr());

        product.setDescriptionFr(request.descriptionFr());
        product.setDescriptionAr(request.descriptionAr());

        product.setCategory(category);

        product.setPrice(request.price());
        product.setOriginalPrice(request.originalPrice());

        product.setTag(request.tag());

        product.setQuantity(
                request.quantity() != null
                        ? request.quantity()
                        : 0
        );

        if (request.imageUrls() != null) {
            product.replaceImages(request.imageUrls());
        }

        // NE PAS gérer les attributes ici.
        // Ils sont synchronisés dans CatalogService.
    }





    public void applyBasicFields(
            Product product,
            ProductUpsertRequest request,
            Category category
    ) {
        product.setNameFr(request.nameFr());
        product.setNameAr(request.nameAr());

        product.setDescriptionFr(request.descriptionFr());
        product.setDescriptionAr(request.descriptionAr());

        product.setCategory(category);

        product.setPrice(request.price());
        product.setOriginalPrice(request.originalPrice());

        product.setTag(request.tag());

        product.setQuantity(
                request.quantity() != null
                        ? request.quantity()
                        : 0
        );

        if (request.imageUrls() != null) {
            product.replaceImages(request.imageUrls());
        }
    }


    /**
     * ============================================================
     * CREATE PRODUCT REQUEST -> PRODUCT ENTITY
     * ============================================================
     *
     * Cette méthode correspond à l'ancien CreateProductRequest
     * utilisé notamment pour le multipart/form-data.
     *
     * Les caractéristiques sont gérées par ProductUpsertRequest.
     */
    public void applyCreateRequest(
            Product product,
            CreateProductRequest request,
            Category category
    ) {

        product.setNameFr(request.getNameFr());
        product.setNameAr(request.getNameAr());

        product.setDescriptionFr(request.getDescriptionFr());
        product.setDescriptionAr(request.getDescriptionAr());

        product.setCategory(category);

        product.setPrice(
                request.getPrice() != null
                        ? request.getPrice()
                        : 0
        );

        product.setOriginalPrice(request.getOriginalPrice());

        product.setTag(request.getTag());

        product.setQuantity(
                request.getQuantity() != null
                        ? request.getQuantity()
                        : 0
        );
    }


    /**
     * ============================================================
     * REQUEST ATTRIBUTES -> ENTITY ATTRIBUTES
     * ============================================================
     */
    private List<ProductAttribute> mapAttributeRequests(
            List<ProductAttributeRequest> requests
    ) {

        if (requests == null || requests.isEmpty()) {
            return new ArrayList<>();
        }

        List<ProductAttribute> attributes = new ArrayList<>();

        for (ProductAttributeRequest request : requests) {

            if (request == null
                    || request.getName() == null
                    || request.getName().isBlank()) {
                continue;
            }

            ProductAttribute attribute = ProductAttribute.builder()

                    .attributeId(
                            request.getId() != null
                                    && !request.getId().isBlank()
                                    ? request.getId()
                                    : UUID.randomUUID().toString()
                    )

                    .name(request.getName())

                    .nameAr(request.getNameAr())

                    .displayOrder(attributes.size())

                    .build();

            List<ProductAttributeValue> values = new ArrayList<>();

            if (request.getValues() != null) {

                for (ProductAttributeValueRequest valueRequest
                        : request.getValues()) {

                    if (valueRequest == null
                            || valueRequest.getValue() == null
                            || valueRequest.getValue().isBlank()) {
                        continue;
                    }

                    ProductAttributeValue value =
                            ProductAttributeValue.builder()

                                    .valueId(
                                            valueRequest.getId() != null
                                                    && !valueRequest.getId().isBlank()
                                                    ? valueRequest.getId()
                                                    : UUID.randomUUID().toString()
                                    )

                                    .value(valueRequest.getValue())

                                    .valueAr(valueRequest.getValueAr())

                                    .displayOrder(values.size())

                                    .build();

                    values.add(value);
                }
            }

            attribute.setValues(values);

            attributes.add(attribute);
        }

        return attributes;
    }


    /**
     * ============================================================
     * ENTITY ATTRIBUTES -> RESPONSE ATTRIBUTES
     * ============================================================
     */
    private List<ProductAttributeResponse> mapAttributes(
            List<ProductAttribute> attributes
    ) {

        if (attributes == null || attributes.isEmpty()) {
            return List.of();
        }

        return attributes.stream()

                .map(attribute ->
                        ProductAttributeResponse.builder()

                                .id(attribute.getAttributeId())

                                .name(attribute.getName())

                                .nameAr(attribute.getNameAr())

                                .values(
                                        attribute.getValues() != null
                                                ? attribute.getValues()
                                                .stream()
                                                .map(value ->
                                                        ProductAttributeValueResponse
                                                                .builder()
                                                                .id(value.getValueId())
                                                                .value(value.getValue())
                                                                .valueAr(value.getValueAr())
                                                                .build()
                                                )
                                                .toList()
                                                : List.of()
                                )

                                .build()
                )

                .toList();
    }
}