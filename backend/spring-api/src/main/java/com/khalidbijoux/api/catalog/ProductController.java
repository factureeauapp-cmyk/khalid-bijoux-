package com.khalidbijoux.api.catalog;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final CatalogService catalogService;

    public ProductController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/products")
    public List<Product> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String tag
    ) {
        return catalogService.getProducts(category, search, maxPrice, tag);
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        return catalogService.getProduct(id);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return catalogService.getCategories();
    }
}
