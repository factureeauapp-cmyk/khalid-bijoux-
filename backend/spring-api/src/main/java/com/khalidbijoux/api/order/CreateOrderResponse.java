package com.khalidbijoux.api.order;

public record CreateOrderResponse(
        String status,
        String orderNumber,
        int subtotal,
        int shipping,
        int tax,
        int total
) {
}
