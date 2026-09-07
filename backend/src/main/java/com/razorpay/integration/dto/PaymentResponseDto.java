package com.razorpay.integration.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.razorpay.integration.model.PaymentMethod;
import com.razorpay.integration.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponseDto {
    private String orderId;
    private Object amount; // Long in paise for online, BigDecimal in rupees for COD
    private String currency;
    private String keyId;
    private PaymentMethod method;
    private PaymentStatus status;
}
