package com.khalidbijoux.api.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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
            @RequestParam(required = false) String tag
    ) {
        return catalogService.getProducts(category, search, maxPrice, tag);
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable String id) {
        return catalogService.getProduct(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product createProduct(@ModelAttribute CreateProductRequest request) throws IOException {

        System.out.println("===== CREATE PRODUCT =====");
        System.out.println("Name FR : " + request.getNameFr());
        System.out.println("Name AR : " + request.getNameAr());
        System.out.println("Category : " + request.getCategoryId());
        System.out.println("Price : " + request.getPrice());

        if (request.getImage() != null) {
            System.out.println("Image : " + request.getImage().getOriginalFilename());
        }

        return catalogService.createProduct(request);
    }
}