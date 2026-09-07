package com.razorpay.integration.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.integration.dto.CreatePaymentRequest;
import com.razorpay.integration.dto.PaymentResponseDto;
import com.razorpay.integration.dto.VerifyPaymentRequest;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.*;
import com.razorpay.integration.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final WhatsAppService whatsAppService;
    private final RazorpayClient razorpayClient;
    private final ObjectMapper objectMapper;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.webhook-secret:yourWebhookSecret}")
    private String webhookSecret;

    private static final SecureRandom RANDOM = new SecureRandom();

    public PaymentMethod mapRazorpayMethodToEnum(String razorpayMethod) {
        if (razorpayMethod == null) return PaymentMethod.CARD;
        String upper = razorpayMethod.toUpperCase();
        return switch (upper) {
            case "UPI" -> PaymentMethod.UPI;
            case "CARD" -> PaymentMethod.CARD;
            case "NETBANKING", "BANK" -> PaymentMethod.NETBANKING;
            case "WALLET" -> PaymentMethod.WALLET;
            default -> PaymentMethod.CARD;
        };
    }

    @Transactional
    public PaymentResponseDto createPayment(CreatePaymentRequest request) {
        BigDecimal amount = request.getAmount();
        String currency = request.getCurrency() != null ? request.getCurrency() : "INR";
        PaymentMethod method = request.getMethod();

        if (method == PaymentMethod.COD) {
            byte[] bytes = new byte[8];
            RANDOM.nextBytes(bytes);
            String orderId = "COD-" + HexFormat.of().formatHex(bytes).toUpperCase();

            com.razorpay.integration.model.Payment payment = com.razorpay.integration.model.Payment.builder()
                    .orderId(orderId)
                    .amount(amount)
                    .currency(currency)
                    .method(method)
                    .status(PaymentStatus.PENDING)
                    .customerEmail(request.getCustomerEmail())
                    .customerCountryCode(request.getCustomerCountryCode() != null ? request.getCustomerCountryCode() : "+91")
                    .customerPhone(request.getCustomerPhone())
                    .build();

            payment = paymentRepository.save(payment);

            return PaymentResponseDto.builder()
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .method(payment.getMethod())
                    .status(payment.getStatus())
                    .build();
        } else {
            try {
                long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", currency);
                orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 8));

                Order razorpayOrder = razorpayClient.orders.create(orderRequest);
                String razorpayOrderId = razorpayOrder.get("id");

                com.razorpay.integration.model.Payment payment = com.razorpay.integration.model.Payment.builder()
                        .orderId(razorpayOrderId)
                        .amount(amount)
                        .currency(currency)
                        .method(method)
                        .status(PaymentStatus.PENDING)
                        .customerEmail(request.getCustomerEmail())
                        .customerCountryCode(request.getCustomerCountryCode() != null ? request.getCustomerCountryCode() : "+91")
                        .customerPhone(request.getCustomerPhone())
                        .build();

                payment = paymentRepository.save(payment);

                return PaymentResponseDto.builder()
                        .orderId(payment.getOrderId())
                        .amount(amountInPaise)
                        .currency(payment.getCurrency())
                        .keyId(keyId)
                        .method(payment.getMethod())
                        .status(payment.getStatus())
                        .build();
            } catch (Exception e) {
                log.error("Razorpay Order Creation Failed: {}", e.getMessage(), e);
                throw new AppException("Razorpay Order Creation Failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Transactional
    public void completeOnlineOrder(Integer orderId, PaymentMethod finalMethod) {
        com.razorpay.integration.model.Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null || order.getStatus() == OrderStatus.PAID) {
            return;
        }

        // Decrement product inventory
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(Math.max(0, product.getStock() - item.getQuantity()));
            productRepository.save(product);
        }

        // Clear Cart items
        if (order.getCartId() != null) {
            cartItemRepository.deleteByCartId(order.getCartId());
        }

        // Update Order status
        order.setStatus(OrderStatus.PAID);
        order.setPaymentMethod(finalMethod);
        orderRepository.save(order);

        // Send WhatsApp notification
        String customerName = order.getUser() != null ? order.getUser().getName() : "Customer";
        String toPhone = (order.getCustomerCountryCode() != null ? order.getCustomerCountryCode() : "+91") + order.getCustomerPhone();
        whatsAppService.sendOrderConfirmation(toPhone, customerName, order.getOrderNumber(), order.getTotalAmount(), order.getShippingAddress());
    }

    @Transactional
    public com.razorpay.integration.model.Payment verifySignature(VerifyPaymentRequest request) {
        String razorpayOrderId = request.getRazorpay_order_id();
        String razorpayPaymentId = request.getRazorpay_payment_id();
        String razorpaySignature = request.getRazorpay_signature();

        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        String generatedSignature = calculateHmacSha256(payload, keySecret);

        if (!generatedSignature.equalsIgnoreCase(razorpaySignature)) {
            paymentRepository.findByOrderId(razorpayOrderId).ifPresent(p -> {
                p.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(p);
            });
            throw new AppException("Payment verification failed: Signature mismatch", HttpStatus.BAD_REQUEST);
        }

        PaymentMethod finalMethod = PaymentMethod.CARD;
        try {
            Payment razorpayPayment = razorpayClient.payments.fetch(razorpayPaymentId);
            if (razorpayPayment != null && razorpayPayment.has("method")) {
                finalMethod = mapRazorpayMethodToEnum(razorpayPayment.get("method"));
            }
        } catch (Exception e) {
            log.error("Failed to fetch payment details from Razorpay: {}", e.getMessage());
        }

        com.razorpay.integration.model.Payment payment = paymentRepository.findByOrderId(razorpayOrderId)
                .orElseThrow(() -> new AppException("Payment record not found for orderId: " + razorpayOrderId, HttpStatus.NOT_FOUND));

        payment.setPaymentId(razorpayPaymentId);
        payment.setSignature(razorpaySignature);
        payment.setStatus(PaymentStatus.CAPTURED);
        payment.setMethod(finalMethod);
        payment = paymentRepository.save(payment);

        if (payment.getOrderRef() != null) {
            completeOnlineOrder(payment.getOrderRef().getId(), finalMethod);
        }

        return payment;
    }

    @Transactional
    public Map<String, Object> handleWebhook(String rawBody, String signature) {
        if (webhookSecret == null || webhookSecret.trim().isEmpty()) {
            throw new AppException("Webhook secret not configured", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String expectedSignature = calculateHmacSha256(rawBody, webhookSecret);
        if (!expectedSignature.equalsIgnoreCase(signature)) {
            throw new AppException("Invalid webhook signature", HttpStatus.BAD_REQUEST);
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String eventType = root.path("event").asText();

            if ("payment.captured".equals(eventType)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String orderId = paymentEntity.path("order_id").asText();
                String paymentId = paymentEntity.path("id").asText();
                String razorpayMethod = paymentEntity.path("method").asText();
                PaymentMethod finalMethod = mapRazorpayMethodToEnum(razorpayMethod);

                if (orderId != null && !orderId.isEmpty()) {
                    paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
                        payment.setStatus(PaymentStatus.CAPTURED);
                        payment.setPaymentId(paymentId);
                        payment.setMethod(finalMethod);
                        paymentRepository.save(payment);

                        if (payment.getOrderRef() != null) {
                            completeOnlineOrder(payment.getOrderRef().getId(), finalMethod);
                        }
                    });
                }
            }
        } catch (Exception e) {
            throw new AppException("Invalid Webhook JSON payload", HttpStatus.BAD_REQUEST);
        }

        return Map.of("received", true);
    }

    public static String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC-SHA256 signature", e);
        }
    }
}
