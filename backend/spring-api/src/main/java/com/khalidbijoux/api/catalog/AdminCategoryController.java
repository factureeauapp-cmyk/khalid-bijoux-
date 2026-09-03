package com.khalidbijoux.api.catalog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    /**
     * =========================================================
     * CREATE CATEGORY
     * POST /api/admin/categories
     *
     * JWT + ROLE_ADMIN requis
     * =========================================================
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        return categoryService.create(request);
    }

    /**
     * =========================================================
     * UPDATE CATEGORY
     * PUT /api/admin/categories/{id}
     *
     * JWT + ROLE_ADMIN requis
     * =========================================================
     */
    @PutMapping("/{id}")
    public Category update(
            @PathVariable String id,
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        return categoryService.update(id, request);
    }

    /**
     * =========================================================
     * DELETE CATEGORY
     * DELETE /api/admin/categories/{id}
     *
     * JWT + ROLE_ADMIN requis
     * =========================================================
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String id
    ) {
        categoryService.deleteCategory(id);
    }
}