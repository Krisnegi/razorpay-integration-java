package com.razorpay.integration.repository;

import com.razorpay.integration.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartIdAndProductId(String cartId, Integer productId);
    void deleteByCartId(String cartId);
    void deleteByCartIdAndProductId(String cartId, Integer productId);
}
