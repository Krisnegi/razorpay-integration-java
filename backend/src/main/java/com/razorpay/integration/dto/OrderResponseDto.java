package com.razorpay.integration.dto;

import com.razorpay.integration.model.OrderStatus;
import com.razorpay.integration.model.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {
    private Integer orderId;
    private String orderNumber;
    private Integer userId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentResponseDto payment;
}
