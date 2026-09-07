package com.razorpay.integration.service;

import com.razorpay.integration.dto.CartItemResponse;
import com.razorpay.integration.dto.CartResponse;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.Cart;
import com.razorpay.integration.model.CartItem;
import com.razorpay.integration.model.Product;
import com.razorpay.integration.model.User;
import com.razorpay.integration.repository.CartItemRepository;
import com.razorpay.integration.repository.CartRepository;
import com.razorpay.integration.repository.ProductRepository;
import com.razorpay.integration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart getOrCreateCart(String cartId, Integer userId) {
        if (cartId != null && !cartId.trim().isEmpty()) {
            Cart existingCart = cartRepository.findById(cartId).orElse(null);
            if (existingCart != null) {
                if (userId != null && (existingCart.getUser() == null || !existingCart.getUser().getId().equals(userId))) {
                    User user = userRepository.findById(userId).orElse(null);
                    existingCart.setUser(user);
                    existingCart = cartRepository.save(existingCart);
                }
                return existingCart;
            }
        }

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        Cart newCart = Cart.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .items(new ArrayList<>())
                .build();

        return cartRepository.save(newCart);
    }

    @Transactional
    public CartResponse getCart(String cartId, Integer userId) {
        Cart cart = getOrCreateCart(cartId, userId);
        return formatCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String cartId, Integer productId, int quantity, Integer userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product with ID " + productId + " not found", HttpStatus.NOT_FOUND));

        Cart cart = getOrCreateCart(cartId, userId);

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId).orElse(null);
        int currentQty = existingItem != null ? existingItem.getQuantity() : 0;
        int newQuantity = currentQty + quantity;

        if (newQuantity > product.getStock()) {
            throw new AppException(
                    String.format("Insufficient stock for %s. Available: %d, Requested total: %d",
                            product.getName(), product.getStock(), newQuantity),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (existingItem != null) {
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return formatCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse updateItemQuantity(String cartId, Integer productId, int quantity, Integer userId) {
        Cart cart = getOrCreateCart(cartId, userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product with ID " + productId + " not found", HttpStatus.NOT_FOUND));

        if (quantity > product.getStock()) {
            throw new AppException(
                    String.format("Insufficient stock for %s. Available: %d, Requested: %d",
                            product.getName(), product.getStock(), quantity),
                    HttpStatus.BAD_REQUEST
            );
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new AppException("Product is not in your cart", HttpStatus.NOT_FOUND));

        if (quantity <= 0) {
            if (cart.getItems() != null) {
                cart.getItems().removeIf(item -> item.getId().equals(existingItem.getId()));
            }
            cartItemRepository.delete(existingItem);
        } else {
            existingItem.setQuantity(quantity);
            cartItemRepository.save(existingItem);
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return formatCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse removeItem(String cartId, Integer productId, Integer userId) {
        Cart cart = getOrCreateCart(cartId, userId);

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new AppException("Product is not in your cart", HttpStatus.NOT_FOUND));

        if (cart.getItems() != null) {
            cart.getItems().removeIf(item -> item.getId().equals(existingItem.getId()));
        }
        cartItemRepository.delete(existingItem);

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return formatCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse clearCart(String cartId, Integer userId) {
        Cart cart = getOrCreateCart(cartId, userId);

        cartItemRepository.deleteByCartId(cart.getId());
        if (cart.getItems() != null) {
            cart.getItems().clear();
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return formatCartResponse(updatedCart);
    }

    public CartResponse formatCartResponse(Cart cart) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        int itemCount = 0;
        List<CartItemResponse> itemResponses = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                BigDecimal itemPrice = item.getProduct().getPrice();
                BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

                totalAmount = totalAmount.add(itemTotal);
                itemCount += item.getQuantity();

                itemResponses.add(CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .name(item.getProduct().getName())
                        .price(itemPrice)
                        .imageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .stock(item.getProduct().getStock())
                        .itemTotal(itemTotal)
                        .build());
            }
        }

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(itemResponses)
                .itemCount(itemCount)
                .totalAmount(totalAmount)
                .build();
    }
}
