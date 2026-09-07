package com.razorpay.integration.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;

@Slf4j
@Service
public class WhatsAppService {

    @Value("${meta.access-token:your_meta_access_token}")
    private String accessToken;

    @Value("${meta.phone-number-id:your_whatsapp_phone_number_id}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOrderConfirmation(String toPhone, String customerName, String orderNumber, BigDecimal totalAmount, String shippingAddress) {
        if (accessToken == null || phoneNumberId == null ||
            "your_meta_access_token".equals(accessToken) ||
            "your_whatsapp_phone_number_id".equals(phoneNumberId)) {

            NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            log.info("""
                    
                    📱 [WhatsApp Sandbox Dry-Run Mode]
                    --------------------------------------------------
                    To: {}
                    Body Template: order_confirmation
                    Variables:
                      1. Name: {}
                      2. Order Number: {}
                      3. Total Amount: {}
                      4. Address: {}
                    --------------------------------------------------
                    """, toPhone, customerName, orderNumber, currencyFormat.format(totalAmount), shippingAddress);
            return;
        }

        try {
            String url = "https://graph.facebook.com/v18.0/" + phoneNumberId + "/messages";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> payload = new HashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", toPhone);
            payload.put("type", "template");

            Map<String, Object> template = new HashMap<>();
            template.put("name", "order_confirmation");
            template.put("language", Map.of("code", "en"));

            List<Map<String, String>> parameters = List.of(
                    Map.of("type", "text", "text", customerName),
                    Map.of("type", "text", "text", orderNumber),
                    Map.of("type", "text", "text", "₹" + totalAmount.toString()),
                    Map.of("type", "text", "text", shippingAddress != null ? shippingAddress : "")
            );

            template.put("components", List.of(Map.of("type", "body", "parameters", parameters)));
            payload.put("template", template);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[WhatsApp Service Success] Order notification sent successfully: {}", response.getBody());
            } else {
                log.error("[WhatsApp Service Error] Meta Graph API error: {}", response.getBody());
            }
        } catch (Exception e) {
            log.error("[WhatsApp Service Error] Network request failed: {}", e.getMessage(), e);
        }
    }
}
