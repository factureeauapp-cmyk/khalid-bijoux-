package com.khalidbijoux.api.order;

public class OrderStatusException extends RuntimeException {
    public OrderStatusException(String message) {
        super(message);
    }

    public OrderStatusException(String message, Throwable cause) {
        super(message, cause);
    }
}
