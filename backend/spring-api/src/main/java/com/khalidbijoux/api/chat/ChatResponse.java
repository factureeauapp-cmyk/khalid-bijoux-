package com.khalidbijoux.api.chat;

import com.khalidbijoux.api.catalog.Product;
import java.util.List;

public record ChatResponse(
        String role,
        String content,
        List<Product> products,
        ChatAction action
) {
}
