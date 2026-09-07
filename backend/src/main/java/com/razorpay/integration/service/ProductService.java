package com.razorpay.integration.service;

import com.razorpay.integration.dto.PaginationDto;
import com.razorpay.integration.dto.ProductsResponse;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.Product;
import com.razorpay.integration.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public ProductsResponse getProducts(int page, int limit, String category, String search) {
        int pageNumber = Math.max(0, page - 1);
        Pageable pageable = PageRequest.of(pageNumber, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cleanCategory = (category != null && !category.trim().isEmpty()) ? category.trim() : null;
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        Page<Product> productPage;

        if (cleanCategory != null && cleanSearch != null) {
            productPage = productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCaseOrCategoryIgnoreCaseAndDescriptionContainingIgnoreCase(
                    cleanCategory, cleanSearch, cleanCategory, cleanSearch, pageable);
        } else if (cleanCategory != null) {
            productPage = productRepository.findByCategoryIgnoreCase(cleanCategory, pageable);
        } else if (cleanSearch != null) {
            productPage = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(cleanSearch, cleanSearch, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        PaginationDto pagination = PaginationDto.builder()
                .page(page)
                .limit(limit)
                .totalItems(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ProductsResponse.builder()
                .products(productPage.getContent())
                .pagination(pagination)
                .build();
    }

    @Transactional(readOnly = true)
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product with ID " + id + " not found", HttpStatus.NOT_FOUND));
    }
}
