package com.razorpay.integration.controller;

import com.razorpay.integration.dto.AddToCartRequest;
import com.razorpay.integration.dto.ApiResponse;
import com.razorpay.integration.dto.CartResponse;
import com.razorpay.integration.dto.UpdateCartItemRequest;
import com.razorpay.integration.security.UserPrincipal;
import com.razorpay.integration.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    private Integer getUserId(UserPrincipal userPrincipal) {
        return userPrincipal != null ? userPrincipal.getId() : null;
    }

    private String resolveCartId(String headerCartId, String queryCartId, String bodyCartId) {
        if (headerCartId != null && !headerCartId.isBlank()) return headerCartId;
        if (queryCartId != null && !queryCartId.isBlank()) return queryCartId;
        if (bodyCartId != null && !bodyCartId.isBlank()) return bodyCartId;
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @RequestParam(value = "cartId", required = false) String queryCartId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String cartId = resolveCartId(headerCartId, queryCartId, null);
        CartResponse response = cartService.getCart(cartId, getUserId(userPrincipal));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String cartId = resolveCartId(headerCartId, null, request.getCartId());
        CartResponse response = cartService.addItem(cartId, request.getProductId(), request.getQuantity(), getUserId(userPrincipal));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @RequestMapping(value = "/items/{productId}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            @PathVariable Integer productId,
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @RequestParam(value = "cartId", required = false) String queryCartId,
            @Valid @RequestBody UpdateCartItemRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String cartId = resolveCartId(headerCartId, queryCartId, null);
        CartResponse response = cartService.updateItemQuantity(cartId, productId, request.getQuantity(), getUserId(userPrincipal));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Integer productId,
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @RequestParam(value = "cartId", required = false) String queryCartId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String cartId = resolveCartId(headerCartId, queryCartId, null);
        CartResponse response = cartService.removeItem(cartId, productId, getUserId(userPrincipal));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            @RequestHeader(value = "x-cart-id", required = false) String headerCartId,
            @RequestParam(value = "cartId", required = false) String queryCartId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String cartId = resolveCartId(headerCartId, queryCartId, null);
        CartResponse response = cartService.clearCart(cartId, getUserId(userPrincipal));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
