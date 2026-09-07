package com.razorpay.integration.controller;

import com.razorpay.integration.dto.ApiResponse;
import com.razorpay.integration.dto.CreatePaymentRequest;
import com.razorpay.integration.dto.PaymentResponseDto;
import com.razorpay.integration.dto.VerifyPaymentRequest;
import com.razorpay.integration.exception.AppException;
import com.razorpay.integration.model.Payment;
import com.razorpay.integration.repository.PaymentRepository;
import com.razorpay.integration.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> createOrder(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponseDto response = paymentService.createPayment(request);
        return new ResponseEntity<>(ApiResponse.success(response), HttpStatus.CREATED);
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        Payment payment = paymentService.verifySignature(request);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @RequestBody String rawBody,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        Map<String, Object> response = paymentService.handleWebhook(rawBody, signature);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentStatus(@PathVariable String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException("Payment not found for orderId: " + orderId, HttpStatus.NOT_FOUND));

        return ResponseEntity.ok(ApiResponse.success(payment));
    }
}
