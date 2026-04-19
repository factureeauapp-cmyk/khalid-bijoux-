package com.khalidbijoux.api.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateOrderRequest(
        @Valid
        CustomerRequest customer,
        @Valid
        AddressRequest shippingAddress,
        @NotBlank(message = "paymentMethod is required")
        String paymentMethod,
        @Valid
        @NotEmpty(message = "items are required")
        List<OrderItemRequest> items
) {
}
