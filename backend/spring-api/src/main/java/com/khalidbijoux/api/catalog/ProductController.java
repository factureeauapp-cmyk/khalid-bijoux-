package com.khalidbijoux.api.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;

    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "true") boolean availableOnly
    ) {
        return catalogService.getProducts(category, search, maxPrice, tag, availableOnly);
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable String id) {
        return catalogService.getProduct(id);
    }

    @GetMapping("/stock-summary")
    public StockSummaryResponse getStockSummary() {
        return catalogService.getStockSummary();
    }

}
