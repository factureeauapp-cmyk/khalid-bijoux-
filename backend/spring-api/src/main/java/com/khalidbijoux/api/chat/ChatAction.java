package com.khalidbijoux.api.chat;

import com.khalidbijoux.api.catalog.Product;
import com.khalidbijoux.api.catalog.ProductResponse;

public record ChatAction(
        String type,
        ProductResponse product
) {
}
