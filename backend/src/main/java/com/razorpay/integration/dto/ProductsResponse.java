package com.razorpay.integration.dto;

import com.razorpay.integration.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductsResponse {
    private List<Product> products;
    private PaginationDto pagination;
}
