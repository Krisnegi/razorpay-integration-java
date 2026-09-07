package com.razorpay.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Integer id;
    private Integer productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Integer quantity;
    private Integer stock;
    private BigDecimal itemTotal;
}
