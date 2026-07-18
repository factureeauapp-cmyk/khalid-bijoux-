package com.khalidbijoux.api.catalog;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CatalogService {

    private final CatalogRepository catalogRepository;
    private final  CategoryRepository  categoryRepository;
    private final FileStorageService fileStorageService;
    private final String baseUrl;


    public CatalogService(
            CatalogRepository catalogRepository,
            CategoryRepository categoryRepository,
            FileStorageService fileStorageService,
            @Value("${app.base-url}") String baseUrl) {

        this.catalogRepository = catalogRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.baseUrl = baseUrl;
    }

    public List<ProductResponse> getProducts(String category,
                                             String search,
                                             Integer maxPrice,
                                             String tag) {

        return catalogRepository.findAll().stream()

                .filter(product ->
                        isBlank(category)
                                || (product.getCategory() != null
                                && product.getCategory().getId().equals(category)))

                .filter(product ->
                        isBlank(search)
                                || matchesSearch(product, search))

                .filter(product ->
                        maxPrice == null
                                || product.getPrice() <= maxPrice)

                .filter(product ->
                        isBlank(tag)
                                || (product.getTag() != null
                                && product.getTag().equalsIgnoreCase(tag)))

                .sorted(
                        Comparator
                                .comparing(
                                        (Product p) -> p.getCategory() != null
                                                ? p.getCategory().getNameFr()
                                                : ""
                                )
                                .thenComparing(Product::getNameFr)
                )

                .map(this::toResponse)

                .toList();
    }

    public ProductResponse getProduct(String id) {

        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable : " + id));

        return toResponse(product);
    }


    private String buildImageUrl(String image) {

        if (image == null || image.isBlank()) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        return baseUrl + image;
    }

    private ProductResponse toResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .nameFr(product.getNameFr())
                .nameAr(product.getNameAr())
                .descriptionFr(product.getDescriptionFr())
                .descriptionAr(product.getDescriptionAr())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .tag(product.getTag())
                .image(buildImageUrl(product.getImage()))
                .category(CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .nameFr(product.getCategory().getNameFr())
                        .nameAr(product.getCategory().getNameAr())
                        .build())
                .build();
    }

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    public List<ProductResponse> recommendProducts(String message) {

        String normalized = message == null ? "" : message.toLowerCase(Locale.ROOT);

        if (normalized.contains("ring"))
            return getProducts("Rings", null, null, null).stream().limit(4).toList();

        if (normalized.contains("earring"))
            return getProducts("Earrings", null, null, null).stream().limit(4).toList();

        if (normalized.contains("necklace"))
            return getProducts("Necklaces", null, null, null).stream().limit(4).toList();

        if (normalized.contains("bracelet"))
            return getProducts("Bracelets", null, null, null).stream().limit(4).toList();

        if (normalized.contains("set"))
            return getProducts("Sets", null, null, null).stream().limit(4).toList();

        Integer budget = extractBudget(normalized);

        if (budget != null) {
            return getProducts(null, null, budget, null)
                    .stream()
                    .limit(4)
                    .toList();
        }

        return catalogRepository.findAll()
                .stream()
                .map(this::toResponse)
                .limit(4)
                .toList();
    }

    private boolean matchesSearch(Product product, String search) {

        String query = search.toLowerCase(Locale.ROOT);

        return Arrays.asList(
                        product.getNameFr(),
                        product.getNameAr(),
                        product.getDescriptionFr(),
                        product.getDescriptionAr(),
                        product.getCategory() != null ? product.getCategory().getNameFr() : null,
                        product.getCategory() != null ? product.getCategory().getNameAr() : null,
                        product.getTag()
                )
                .stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .anyMatch(text -> text.contains(query));
    }

    private Integer extractBudget(String message) {

        String digits = message.replaceAll("[^0-9]", " ").trim();

        if (digits.isEmpty())
            return null;

        return Integer.parseInt(digits.split("\\s+")[0]);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public Product createProduct(CreateProductRequest request) {

        try {

            Product product = new Product();



            product.setId(UUID.randomUUID().toString());

            product.setNameFr(request.getNameFr());
            product.setNameAr(request.getNameAr());

            product.setDescriptionFr(request.getDescriptionFr());
            product.setDescriptionAr(request.getDescriptionAr());



            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));

            product.setCategory(category);

            product.setPrice(request.getPrice());
            product.setOriginalPrice(request.getOriginalPrice());

            product.setTag(request.getTag());

            String imagePath = fileStorageService.saveImage(request.getImage());
            product.setImage(imagePath);

            Product saved = catalogRepository.save(product);

            saved.setId(String.format("PRD-%06d", saved.getPk()));


            return catalogRepository.save(saved);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


}