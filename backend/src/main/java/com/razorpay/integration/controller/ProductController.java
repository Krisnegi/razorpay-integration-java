package com.razorpay.integration.controller;

import com.razorpay.integration.dto.ApiResponse;
import com.razorpay.integration.dto.ProductsResponse;
import com.razorpay.integration.model.Product;
import com.razorpay.integration.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        ProductsResponse response = productService.getProducts(page, limit, category, search);
        return ResponseEntity.ok(ApiResponse.success(response.getProducts(), response.getPagination()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }
}
