package com.khalidbijoux.api.order;

public record SelectedAttributeRequest(
        String attributeName,
        String attributeNameAr,
        String selectedValue,
        String selectedValueAr
) {
}