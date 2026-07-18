package com.khalidbijoux.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogRepository extends JpaRepository<Product, Long> {

    List<Product> findAll();

    Optional<Product> findById(String id);




}
