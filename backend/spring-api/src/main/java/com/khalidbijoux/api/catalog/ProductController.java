package com.khalidbijoux.api.catalog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@ModelAttribute CreateProductRequest request) throws IOException {
        return catalogService.createProduct(request);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse updateProduct(@PathVariable String id, @ModelAttribute CreateProductRequest request) {
        return catalogService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        catalogService.deleteProduct(id);
    }

    @PostMapping("/{id}/stock/add")
    public ProductResponse addStock(@PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        return catalogService.addStock(id, request.quantity());
    }

    @PutMapping("/{id}/stock")
    public ProductResponse updateStock(@PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        return catalogService.updateStock(id, request.quantity());
    }

    @PostMapping("/{id}/stock/decrease")
    public ProductResponse decreaseStock(@PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        return catalogService.decreaseStock(id, request.quantity());
    }
}