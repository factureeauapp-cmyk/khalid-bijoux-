package com.khalidbijoux.api.catalog;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.Optional;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

@Repository
public class JsonCatalogRepository{
//
//    private final ObjectMapper objectMapper;
//    private List<Product> products = List.of();
//
//    public JsonCatalogRepository(ObjectMapper objectMapper) {
//        this.objectMapper = objectMapper;
//    }
//
//    @PostConstruct
//    void loadCatalog() {
//        ClassPathResource resource = new ClassPathResource("catalog/products.json");
//        try (InputStream inputStream = resource.getInputStream()) {
//            products = objectMapper.readValue(inputStream, new TypeReference<>() {});
//        } catch (IOException exception) {
//            throw new UncheckedIOException("Unable to load catalog/products.json", exception);
//        }
//    }
//
//    @Override
//    public List<Product> findAll() {
//        return products;
//    }
//
//    @Override
//    public Optional<Product> findById(String id) {
//        return products.stream()
//                .filter(product -> product.id().equalsIgnoreCase(id))
//                .findFirst();
//    }
}
