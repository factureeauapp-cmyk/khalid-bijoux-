package com.khalidbijoux.api.catalog;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeRequest {

    private String id;

    private String name;

    private String nameAr;

    private List<ProductAttributeValueRequest> values;
}