package com.razorpay.integration.controller;

import com.razorpay.integration.dto.ApiResponse;
import com.razorpay.integration.dto.CheckoutRequest;
import com.razorpay.integration.dto.OrderResponseDto;
import com.razorpay.integration.dto.OrdersResponseDto;
import com.razorpay.integration.model.Order;
import com.razorpay.integration.security.UserPrincipal;
import com.razorpay.integration.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponseDto>> checkout(
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = userPrincipal != null ? userPrincipal.getId() : null;
        OrderResponseDto response = orderService.checkout(headerCartId, request, userId);
        return new ResponseEntity<>(ApiResponse.success(response), HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        OrdersResponseDto response = orderService.getMyOrders(userPrincipal.getId(), page, limit);
        return ResponseEntity.ok(ApiResponse.success(response.getOrders(), response.getPagination()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = userPrincipal != null ? userPrincipal.getId() : null;
        Order order = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
}
