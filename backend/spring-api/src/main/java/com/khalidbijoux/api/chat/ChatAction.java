package com.khalidbijoux.api.chat;

import com.khalidbijoux.api.catalog.Product;

public record ChatAction(
        String type,
        Product product
) {
}
