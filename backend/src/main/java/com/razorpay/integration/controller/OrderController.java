package com.razorpay.integration.controller;

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

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDto> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = userPrincipal != null ? userPrincipal.getId() : null;
        OrderResponseDto response = orderService.checkout(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<OrdersResponseDto> getMyOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        OrdersResponseDto response = orderService.getMyOrders(userPrincipal.getId(), page, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = userPrincipal != null ? userPrincipal.getId() : null;
        Order order = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(order);
    }
}
