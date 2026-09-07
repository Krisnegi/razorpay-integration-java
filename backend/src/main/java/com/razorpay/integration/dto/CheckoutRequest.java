package com.razorpay.integration.dto;

import com.razorpay.integration.model.PaymentMethod;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotBlank(message = "cartId is required")
    private String cartId;

    @NotBlank(message = "customerEmail is required")
    @Email(message = "Invalid customerEmail format")
    private String customerEmail;

    private String customerCountryCode;
    private String customerPhone;
    private String shippingAddress;

    @NotNull(message = "paymentMethod is required")
    private PaymentMethod paymentMethod;
}
