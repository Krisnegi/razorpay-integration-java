package com.razorpay.integration.service;

import com.razorpay.integration.dto.*;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.*;
import com.razorpay.integration.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final WhatsAppService whatsAppService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public OrderResponseDto checkout(CheckoutRequest request, Integer userId) {
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new AppException("Your cart is empty", HttpStatus.BAD_REQUEST));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new AppException("Your cart is empty", HttpStatus.BAD_REQUEST);
        }

        for (CartItem item : cart.getItems()) {
            if (item.getQuantity() > item.getProduct().getStock()) {
                throw new AppException(
                        String.format("Insufficient stock for %s. Requested: %d, Available: %d",
                                item.getProduct().getName(), item.getQuantity(), item.getProduct().getStock()),
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        byte[] bytes = new byte[3];
        RANDOM.nextBytes(bytes);
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + HexFormat.of().formatHex(bytes).toUpperCase();

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .cartId(request.getCartId())
                .customerEmail(request.getCustomerEmail())
                .customerCountryCode(request.getCustomerCountryCode() != null ? request.getCustomerCountryCode() : "+91")
                .customerPhone(request.getCustomerPhone())
                .shippingAddress(request.getShippingAddress())
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .items(new ArrayList<>())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProduct().getPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        order = orderRepository.save(order);

        // Immediate inventory decrement & cart clear for COD orders
        if (request.getPaymentMethod() == PaymentMethod.COD) {
            for (CartItem cartItem : cart.getItems()) {
                Product product = cartItem.getProduct();
                product.setStock(Math.max(0, product.getStock() - cartItem.getQuantity()));
                productRepository.save(product);
            }
            cartItemRepository.deleteByCartId(request.getCartId());
        }

        // Create Payment record
        CreatePaymentRequest paymentReq = new CreatePaymentRequest();
        paymentReq.setAmount(order.getTotalAmount());
        paymentReq.setCurrency("INR");
        paymentReq.setMethod(request.getPaymentMethod());
        paymentReq.setCustomerEmail(request.getCustomerEmail());
        paymentReq.setCustomerCountryCode(request.getCustomerCountryCode());
        paymentReq.setCustomerPhone(request.getCustomerPhone());

        PaymentResponseDto paymentResult = paymentService.createPayment(paymentReq);

        // Link payment record to Order
        com.razorpay.integration.model.Payment payment = paymentRepository.findByOrderId(paymentResult.getOrderId()).orElse(null);
        if (payment != null) {
            payment.setOrderRef(order);
            paymentRepository.save(payment);
        }

        // Trigger WhatsApp notification for COD
        if (request.getPaymentMethod() == PaymentMethod.COD) {
            String customerName = user != null ? user.getName() : "Customer";
            String toPhone = (request.getCustomerCountryCode() != null ? request.getCustomerCountryCode() : "+91") + request.getCustomerPhone();
            whatsAppService.sendOrderConfirmation(toPhone, customerName, order.getOrderNumber(), order.getTotalAmount(), request.getShippingAddress());
        }

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .payment(paymentResult)
                .build();
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Integer id, Integer userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND));

        if (userId != null && (order.getUser() == null || !order.getUser().getId().equals(userId))) {
            throw new AppException("Unauthorized access to this order", HttpStatus.FORBIDDEN);
        }

        return order;
    }

    @Transactional(readOnly = true)
    public OrdersResponseDto getMyOrders(Integer userId, int page, int limit) {
        int pageNumber = Math.max(0, page - 1);
        Pageable pageable = PageRequest.of(pageNumber, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Order> orderPage = orderRepository.findByUserId(userId, pageable);

        PaginationDto pagination = PaginationDto.builder()
                .page(page)
                .limit(limit)
                .totalItems(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .build();

        return OrdersResponseDto.builder()
                .orders(orderPage.getContent())
                .pagination(pagination)
                .build();
    }
}
