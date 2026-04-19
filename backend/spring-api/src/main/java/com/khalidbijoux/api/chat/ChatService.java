package com.khalidbijoux.api.chat;

import com.khalidbijoux.api.catalog.CatalogService;
import com.khalidbijoux.api.catalog.Product;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final CatalogService catalogService;

    public ChatService(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    public ChatResponse reply(String message) {
        String normalized = message.toLowerCase(Locale.ROOT);
        List<Product> recommendations = catalogService.recommendProducts(message);

        if (normalized.contains("add") || normalized.contains("buy") || normalized.contains("order")) {
            Product product = recommendations.stream().findFirst().orElse(null);
            if (product != null) {
                return new ChatResponse(
                        "assistant",
                        "I found a matching piece and prepared it for the cart flow.",
                        List.of(product),
                        new ChatAction("ADD_TO_CART", product)
                );
            }
        }

        if (normalized.contains("budget") || normalized.matches(".*\\d+.*")) {
            return new ChatResponse(
                    "assistant",
                    "Here are curated pieces that fit the budget you mentioned.",
                    recommendations,
                    null
            );
        }

        return new ChatResponse(
                "assistant",
                "Here are some pieces that match your request.",
                recommendations,
                null
        );
    }
}
