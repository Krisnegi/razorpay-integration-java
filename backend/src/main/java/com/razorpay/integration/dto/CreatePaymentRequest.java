package com.razorpay.integration.dto;

import com.razorpay.integration.model.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.01", message = "amount must be greater than 0")
    private BigDecimal amount;

    private String currency = "INR";

    @NotNull(message = "method is required")
    private PaymentMethod method;

    @NotBlank(message = "customerEmail is required")
    @Email(message = "Invalid customerEmail format")
    private String customerEmail;

    private String customerCountryCode = "+91";
    private String customerPhone;
}
