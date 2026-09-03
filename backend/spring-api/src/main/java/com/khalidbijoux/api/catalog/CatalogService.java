package com.khalidbijoux.api.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogRepository catalogRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final ProductMapper productMapper;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(String category,
                                             String search,
                                             Integer maxPrice,
                                             String tag) {
        return getProducts(category, search, maxPrice, tag, true);
    }

    public StockSummaryResponse getStockSummary() {
        List<Product> products = catalogRepository.findAll();
        long totalProducts = products.size();
        long availableProducts = products.stream().filter(product -> product.getQuantity() != null && product.getQuantity() > 0).count();
        long outOfStockProducts = products.stream().filter(product -> product.getQuantity() == null || product.getQuantity() <= 0).count();
        long totalQuantity = products.stream().mapToLong(product -> product.getQuantity() == null ? 0 : product.getQuantity()).sum();
        long totalValue = products.stream().mapToLong(product -> (product.getPrice() == null ? 0 : product.getPrice()) * (product.getQuantity() == null ? 0 : product.getQuantity())).sum();

        return StockSummaryResponse.builder()
                .totalProducts(totalProducts)
                .availableProducts(availableProducts)
                .outOfStockProducts(outOfStockProducts)
                .totalQuantity(totalQuantity)
                .totalValue(totalValue)
                .build();
    }

    public List<ProductResponse> getProducts(String category,
                                             String search,
                                             Integer maxPrice,
                                             String tag,
                                             boolean availableOnly) {

        return catalogRepository.findAll().stream()

                .filter(product -> !availableOnly || product.getQuantity() != null && product.getQuantity() > 0)

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

                .map(productMapper::toResponse)

                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(String id) {

        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toResponse(product);
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
                .filter(product -> product.getQuantity() != null && product.getQuantity() > 0)
                .map(productMapper::toResponse)
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
        validateProductRequest(request);

        Product product = new Product();
        product.setId(UUID.randomUUID().toString());
        productMapper.applyCreateRequest(product, request, resolveCategory(request.getCategoryId()));

        MultipartFile image = request.getImage();
        product.replaceImages(image != null && !image.isEmpty()
                ? List.of(fileStorageService.saveImage(image))
                : List.of("/placeholder.svg"));

        product.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        Product saved = catalogRepository.save(product);
        saved.setId(String.format("PRD-%06d", saved.getPk()));
        return catalogRepository.save(saved);
    }

    @Transactional
    public ProductResponse createProduct(ProductUpsertRequest request) {

        Product product = new Product();

        // =========================================================
        // ID TEMPORAIRE
        // =========================================================

        product.setId(UUID.randomUUID().toString());

        // =========================================================
        // CHAMPS PRINCIPAUX
        // =========================================================

        Category category = resolveCategory(request.categoryId());

        productMapper.applyUpsertRequest(
                product,
                request,
                category
        );

        // =========================================================
        // ATTRIBUTES
        // =========================================================
        //
        // null = aucun attribut
        // []   = aucun attribut
        // [...] = créer les attributs
        //

        if (request.attributes() != null) {

            syncAttributes(
                    product,
                    request.attributes()
            );
        }

        // =========================================================
        // SAVE
        // =========================================================

        Product saved = catalogRepository.save(product);

        // =========================================================
        // ID PUBLIC
        // =========================================================

        saved.setId(
                String.format(
                        "PRD-%06d",
                        saved.getPk()
                )
        );

        saved = catalogRepository.save(saved);

        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(
            String id,
            ProductUpsertRequest request
    ) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        Category category = resolveCategory(request.categoryId());

        // 1. Champs principaux
        productMapper.applyBasicFields(
                product,
                request,
                category
        );

        // 2. Attributs
        //
        // null = conserver les attributs existants
        // []   = supprimer tous les attributs
        // [...] = synchroniser les attributs
        //
        if (request.attributes() != null) {
            syncAttributes(
                    product,
                    request.attributes()
            );
        }

        // Product déjà managed par Hibernate.
        // save() n'est même pas obligatoire, mais on peut le garder.
        Product saved = catalogRepository.save(product);

        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(String id, CreateProductRequest request) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        validateProductRequest(request);
        productMapper.applyCreateRequest(product, request, resolveCategory(request.getCategoryId()));

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            product.setImage(fileStorageService.saveImage(request.getImage()));
        }

        product.setQuantity(request.getQuantity() != null ? request.getQuantity() : product.getQuantity());
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        return productMapper.toResponse(catalogRepository.save(product));
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        catalogRepository.delete(product);
    }

    @Transactional
    public ProductResponse addStock(String id, Integer quantity) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        validatePositiveQuantity(quantity, "Quantity to add must be positive");
        int current = product.getQuantity() == null ? 0 : product.getQuantity();
        product.setQuantity(current + quantity);
        return productMapper.toResponse(catalogRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStock(String id, Integer quantity) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        validateNonNegativeQuantity(quantity, "Quantity cannot be negative");
        product.setQuantity(quantity);
        return productMapper.toResponse(catalogRepository.save(product));
    }

    @Transactional
    public ProductResponse decreaseStock(String id, Integer quantity) {
        Product product = catalogRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        validatePositiveQuantity(quantity, "Quantity to decrease must be positive");
        int current = product.getQuantity() == null ? 0 : product.getQuantity();
        if (current < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        product.setQuantity(current - quantity);
        return productMapper.toResponse(catalogRepository.save(product));
    }

    private Category resolveCategory(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    private void validatePositiveQuantity(Integer quantity, String message) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateNonNegativeQuantity(Integer quantity, String message) {
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateProductRequest(CreateProductRequest request) {
        if (request.getNameFr() == null || request.getNameFr().isBlank()) {
            throw new IllegalArgumentException("Product name in French is required");
        }
        if (request.getNameAr() == null || request.getNameAr().isBlank()) {
            throw new IllegalArgumentException("Product name in Arabic is required");
        }
        if (request.getDescriptionFr() == null || request.getDescriptionFr().isBlank()) {
            throw new IllegalArgumentException("Product description in French is required");
        }
        if (request.getDescriptionAr() == null || request.getDescriptionAr().isBlank()) {
            throw new IllegalArgumentException("Product description in Arabic is required");
        }
        if (request.getCategoryId() == null || request.getCategoryId().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new IllegalArgumentException("Price must be positive");
        }
        if (request.getQuantity() != null && request.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
    }

    private void syncAttributes(
            Product product,
            List<ProductAttributeRequest> requests
    ) {
        if (requests == null) {
            return;
        }

        // =========================================================
        // ATTRIBUTS EXISTANTS
        // =========================================================

        Map<String, ProductAttribute> existingById =
                product.getAttributes()
                        .stream()
                        .filter(attribute ->
                                attribute.getAttributeId() != null
                        )
                        .collect(Collectors.toMap(
                                ProductAttribute::getAttributeId,
                                attribute -> attribute,
                                (a, b) -> a
                        ));

        // Les entités qui doivent rester après le PUT
        Set<ProductAttribute> attributesToKeep =
                new HashSet<>();

        // =========================================================
        // CREATE / UPDATE
        // =========================================================

        for (int attributeIndex = 0;
             attributeIndex < requests.size();
             attributeIndex++) {

            ProductAttributeRequest request =
                    requests.get(attributeIndex);

            // Ignorer les entrées invalides
            if (request == null ||
                    request.getName() == null ||
                    request.getName().isBlank()) {
                continue;
            }

            ProductAttribute attribute;

            // =====================================================
            // EXISTING ATTRIBUTE
            // =====================================================

            if (request.getId() != null &&
                    !request.getId().isBlank() &&
                    existingById.containsKey(request.getId())) {

                // UPDATE d'un attribut existant
                attribute = existingById.get(request.getId());

            }

            // =====================================================
            // NEW ATTRIBUTE
            // =====================================================

            else {

                // CREATE d'un nouvel attribut
                //
                // L'ID envoyé par le frontend peut être un UUID
                // temporaire. On ne l'utilise PAS.
                attribute = ProductAttribute.builder()
                        .attributeId(UUID.randomUUID().toString())
                        .product(product)
                        .values(new ArrayList<>())
                        .build();

                product.getAttributes().add(attribute);
            }

            attributesToKeep.add(attribute);

            // =====================================================
            // UPDATE ATTRIBUTE
            // =====================================================

            attribute.setName(
                    request.getName().trim()
            );

            attribute.setNameAr(
                    request.getNameAr() != null
                            ? request.getNameAr().trim()
                            : null
            );

            attribute.setDisplayOrder(attributeIndex);

            // =====================================================
            // VALUES
            // =====================================================

            syncAttributeValues(
                    attribute,
                    request.getValues()
            );
        }

        // =========================================================
        // DELETE ATTRIBUTES REMOVED FROM FRONTEND
        // =========================================================

        product.getAttributes().removeIf(
                attribute -> !attributesToKeep.contains(attribute)
        );
    }




    private void syncAttributeValues(
            ProductAttribute attribute,
            List<ProductAttributeValueRequest> requests
    ) {
        if (requests == null) {
            return;
        }

        // =========================================================
        // VALEURS EXISTANTES
        // =========================================================

        Map<String, ProductAttributeValue> existingById =
                attribute.getValues()
                        .stream()
                        .filter(value ->
                                value.getValueId() != null
                        )
                        .collect(Collectors.toMap(
                                ProductAttributeValue::getValueId,
                                value -> value
                        ));

        // Valeurs qui doivent rester
        Set<ProductAttributeValue> valuesToKeep =
                new HashSet<>();

        // =========================================================
        // CREATE / UPDATE
        // =========================================================

        for (int valueIndex = 0;
             valueIndex < requests.size();
             valueIndex++) {

            ProductAttributeValueRequest request =
                    requests.get(valueIndex);

            if (request == null ||
                    request.getValue() == null ||
                    request.getValue().isBlank()) {
                continue;
            }

            ProductAttributeValue value;

            // =====================================================
            // EXISTING VALUE
            // =====================================================

            if (request.getId() != null &&
                    !request.getId().isBlank()) {

                value = existingById.get(request.getId());

                if (value == null) {
                    throw new IllegalArgumentException(
                            "Attribute value not found: "
                                    + request.getId()
                    );
                }

            }

            // =====================================================
            // NEW VALUE
            // =====================================================

            else {

                value = ProductAttributeValue.builder()
                        .valueId(UUID.randomUUID().toString())
                        .attribute(attribute)
                        .build();

                attribute.getValues().add(value);
            }

            valuesToKeep.add(value);

            // =====================================================
            // UPDATE VALUE
            // =====================================================

            value.setValue(
                    request.getValue().trim()
            );

            value.setValueAr(
                    request.getValueAr() != null
                            ? request.getValueAr().trim()
                            : null
            );

            value.setDisplayOrder(valueIndex);
        }

        // =========================================================
        // DELETE VALUES REMOVED FROM FRONTEND
        // =========================================================

        attribute.getValues().removeIf(
                value -> !valuesToKeep.contains(value)
        );
    }
}
