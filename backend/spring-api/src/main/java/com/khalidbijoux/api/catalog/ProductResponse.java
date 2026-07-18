package com.khalidbijoux.api.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private String id;

    private String nameFr;
    private String nameAr;

    private String descriptionFr;
    private String descriptionAr;

    private Integer price;
    private Integer originalPrice;

    private String tag;

    private String image;

    private CategoryResponse category;
}