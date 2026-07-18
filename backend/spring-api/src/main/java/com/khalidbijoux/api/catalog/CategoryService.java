package com.khalidbijoux.api.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;

    public Category create(CreateCategoryRequest request) {

        if (repository.existsByNameFrIgnoreCase(request.getNameFr())) {
            throw new RuntimeException("Cette catégorie existe déjà.");
        }

        Category category = Category.builder()
                .nameFr(request.getNameFr())
                .nameAr(request.getNameAr())
                .build();

        return repository.save(category);
    }

    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    public Category getCategory(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
    }
}