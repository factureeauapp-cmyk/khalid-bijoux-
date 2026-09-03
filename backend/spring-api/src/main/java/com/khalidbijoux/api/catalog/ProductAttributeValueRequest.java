package com.khalidbijoux.api.catalog;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class
ProductAttributeValueRequest {

    private String id;

    private String value;

    private String valueAr;
}