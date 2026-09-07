package com.razorpay.integration.dto;

import com.razorpay.integration.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdersResponseDto {
    private List<Order> orders;
    private PaginationDto pagination;
}
