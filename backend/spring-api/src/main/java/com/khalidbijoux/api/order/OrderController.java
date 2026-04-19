package com.khalidbijoux.api.order;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public CreateOrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderNumber}")
    public Order getOrder(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber);
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderNumber,
            @RequestBody UpdateOrderStatusRequest request) {
        Order updatedOrder = orderService.updateOrderStatus(orderNumber, request.status());
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderNumber}")
    public ResponseEntity<Void> cancelOrder(@PathVariable String orderNumber) {
        orderService.cancelOrder(orderNumber);
        return ResponseEntity.noContent().build();
    }
}

