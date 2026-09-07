package com.razorpay.integration.repository;

import com.razorpay.integration.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String nameSearch, String descSearch, Pageable pageable);

    Page<Product> findByCategoryIgnoreCaseAndNameContainingIgnoreCaseOrCategoryIgnoreCaseAndDescriptionContainingIgnoreCase(
            String cat1, String nameSearch, String cat2, String descSearch, Pageable pageable);
}
