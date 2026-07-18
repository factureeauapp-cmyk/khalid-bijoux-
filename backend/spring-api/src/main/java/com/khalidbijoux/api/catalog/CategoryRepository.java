package com.khalidbijoux.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {

    Optional<Category> findByNameFrIgnoreCase(String nameFr);

    boolean existsByNameFrIgnoreCase(String nameFr);

}