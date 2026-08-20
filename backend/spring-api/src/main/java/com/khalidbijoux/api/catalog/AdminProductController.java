package com.khalidbijoux.api.catalog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** Protected administration API. Public reads remain in ProductController. */
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private final CatalogService catalogService;
    private final FileStorageService fileStorageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductUpsertRequest request) {
        return catalogService.createProduct(request);
    }


    @GetMapping("/test")
    public String test() {
        return "OK";
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable String id, @Valid @RequestBody ProductUpsertRequest request) {
        return catalogService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        catalogService.deleteProduct(id);
    }

    @PostMapping(value = "/upload-images", consumes = "multipart/form-data")
    public List<String> uploadImages(
            @RequestParam("files") List<MultipartFile> files) {

        System.out.println("UPLOAD CALLED");
        System.out.println("FILES COUNT = " + files.size());

        return fileStorageService.saveImages(files);
    }

    @PostMapping("/{id}/stock/add")
    public ProductResponse addStock(@PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        return catalogService.addStock(id, request.quantity());
    }

    @PostMapping("/{id}/stock/decrease")
    public ProductResponse decreaseStock(@PathVariable String id, @Valid @RequestBody StockUpdateRequest request) {
        return catalogService.decreaseStock(id, request.quantity());
    }
}
