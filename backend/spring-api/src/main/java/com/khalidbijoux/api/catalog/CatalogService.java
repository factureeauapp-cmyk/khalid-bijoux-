package com.khalidbijoux.api.catalog;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class CatalogService {

    private final CatalogRepository catalogRepository;

    public CatalogService(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    public List<Product> getProducts(String category, String search, Integer maxPrice, String tag) {
        return catalogRepository.findAll().stream()
                .filter(product -> isBlank(category) || product.getCategory().equalsIgnoreCase(category))
                .filter(product -> isBlank(search) || matchesSearch(product, search))
                .filter(product -> maxPrice == null || product.getPrice() <= maxPrice)
                .filter(product -> isBlank(tag) || (product.getTag() != null && product.getTag().equalsIgnoreCase(tag)))
                .sorted(Comparator.comparing(Product::getCategory).thenComparing(Product::getName))
                .toList();
    }

    public Product getProduct(String idOrExternalId) {
        // Try to parse as Long first
        try {
            long longId = Long.parseLong(idOrExternalId);
            return catalogRepository.findById(longId)
                    .orElseThrow(() -> new ProductNotFoundException(idOrExternalId));
        } catch (NumberFormatException e) {
            // Try as external ID
            return catalogRepository.findByExternalId(idOrExternalId)
                    .orElseThrow(() -> new ProductNotFoundException(idOrExternalId));
        }
    }

    public List<String> getCategories() {
        return catalogRepository.findAll().stream()
                .map(Product::getCategory)
                .collect(Collectors.toCollection(() -> new java.util.TreeSet<>(String.CASE_INSENSITIVE_ORDER)))
                .stream()
                .toList();
    }

    public List<Product> recommendProducts(String message) {
        String normalized = message == null ? "" : message.toLowerCase(Locale.ROOT);

        if (normalized.contains("ring")) {
            return getProducts("Rings", null, null, null).stream().limit(4).toList();
        }
        if (normalized.contains("earring")) {
            return getProducts("Earrings", null, null, null).stream().limit(4).toList();
        }
        if (normalized.contains("necklace")) {
            return getProducts("Necklaces", null, null, null).stream().limit(4).toList();
        }
        if (normalized.contains("bracelet")) {
            return getProducts("Bracelets", null, null, null).stream().limit(4).toList();
        }
        if (normalized.contains("set")) {
            return getProducts("Sets", null, null, null).stream().limit(4).toList();
        }

        Integer detectedBudget = extractBudget(normalized);
        if (detectedBudget != null) {
            return getProducts(null, null, detectedBudget, null).stream().limit(4).toList();
        }

        return catalogRepository.findAll().stream().limit(4).toList();
    }

    private boolean matchesSearch(Product product, String search) {
        String query = search.toLowerCase(Locale.ROOT);
        return Set.of(
                        product.getName(),
                        product.getCategory(),
                        product.getMaterial(),
                        product.getDescription(),
                        product.getTag()
                ).stream()
                .filter(obj -> obj != null)
                .map(value -> value.toLowerCase(Locale.ROOT))
                .anyMatch(value -> value.contains(query));
    }

    private Integer extractBudget(String message) {
        String digits = message.replaceAll("[^0-9]", " ").trim();
        if (digits.isEmpty()) {
            return null;
        }
        String firstToken = digits.split("\\s+")[0];
        return Integer.parseInt(firstToken);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
