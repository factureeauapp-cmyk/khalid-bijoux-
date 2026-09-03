package com.khalidbijoux.api.catalog;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProductUpsertRequest(
        @NotBlank String nameFr,
        @NotBlank String nameAr,
        @NotBlank String descriptionFr,
        @NotBlank String descriptionAr,
        @NotBlank String categoryId,
        @NotNull @Min(0) Integer price,
        @Min(0) Integer originalPrice,
        String tag,
        @NotNull @Min(0) Integer quantity,
        @NotEmpty @Size(max = 10, message = "A product can contain at most 10 images") List<@NotBlank String> imageUrls,
        /**
         * Optionnel.
         * null ou liste vide = produit sans caractéristiques.
         */
        @Valid
        List<ProductAttributeRequest> attributes

) {
}
