package com.khalidbijoux.api.chat;

import com.khalidbijoux.api.catalog.Product;
import com.khalidbijoux.api.catalog.ProductResponse;

import java.util.List;

public record ChatResponse(
        String role,
        String content,
        List<ProductResponse> products,
        ChatAction action
) {
}
