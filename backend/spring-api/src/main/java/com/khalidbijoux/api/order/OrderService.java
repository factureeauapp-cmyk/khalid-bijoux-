package com.khalidbijoux.api.order;

import com.khalidbijoux.api.catalog.CatalogService;
import com.khalidbijoux.api.catalog.Product;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private final CatalogService catalogService;
    private final OrderRepository orderRepository;

    public OrderService(CatalogService catalogService, OrderRepository orderRepository) {
        this.catalogService = catalogService;
        this.orderRepository = orderRepository;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        // Calculate totals
        int subtotal = request.items().stream()
                .mapToInt(item -> {
                    Product product = catalogService.getProduct(item.productId());
                    return product.getPrice() * item.quantity();
                })
                .sum();

        int shipping = subtotal > 5000 ? 0 : 250;
        int tax = Math.round(subtotal * 0.03f);
        int total = subtotal + shipping + tax;

        // Create order number
        String orderNumber = "KB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create Order entity
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setStatus("PENDING");
        order.setPaymentMethod(request.paymentMethod());
        order.setSubtotal(subtotal);
        order.setShipping(shipping);
        order.setTax(tax);
        order.setTotal(total);

        // Map customer info
        CustomerRequest customerReq = request.customer();
        CustomerInfo customerInfo = new CustomerInfo(
                customerReq.firstName(),
                customerReq.lastName(),
                customerReq.phoneNumber(),
                customerReq.email()
        );
        order.setCustomer(customerInfo);

        // Map shipping address
        com.khalidbijoux.api.order.AddressRequest addressReq = request.shippingAddress();
        Address address = new Address(
                addressReq.street(),
                addressReq.city(),
                addressReq.state(),
                addressReq.postalCode(),
                addressReq.country()
        );
        order.setShippingAddress(address);

        // Map order items
        List<OrderItem> items = request.items().stream()
                .map(itemReq -> {
                    Product product = catalogService.getProduct(itemReq.productId());
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(itemReq.productId());
                    orderItem.setQuantity(itemReq.quantity());
                    orderItem.setSelectedSize(itemReq.selectedSize());
                    orderItem.setPrice(product.getPrice());
                    orderItem.setProductName(product.getName());
                    orderItem.setProductImage(product.getImage());
                    return orderItem;
                })
                .toList();
        order.setItems(items);

        // Save order
        orderRepository.save(order);

        return new CreateOrderResponse(
                "PENDING",
                orderNumber,
                subtotal,
                shipping,
                tax,
                total
        );
    }

    /**
     * Get all orders sorted by creation date (newest first)
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .toList();
    }

    /**
     * Get order by order number
     */
    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("Commande non trouvée: " + orderNumber));
    }

    /**
     * Update order status with validation
     * Valid statuses: PENDING, SHIPPED, DELIVERED, CANCELLED
     */
    public Order updateOrderStatus(String orderNumber, String newStatus) {
        Order order = getOrderByNumber(orderNumber);

        // Validate status
        validateOrderStatus(newStatus);

        // Prevent updates to delivered/cancelled orders
        if ("DELIVERED".equalsIgnoreCase(order.getStatus()) ||
            "CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new OrderStatusException("Cannot update status of a " + order.getStatus().toLowerCase() + " order");
        }

        order.setStatus(newStatus.toUpperCase());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    /**
     * Cancel an order
     */
    public void cancelOrder(String orderNumber) {
        Order order = getOrderByNumber(orderNumber);

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new OrderStatusException("Order is already cancelled");
        }
        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new OrderStatusException("Cannot cancel a delivered order");
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * Validate order status
     */
    private void validateOrderStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        String normalizedStatus = status.toUpperCase();
        if (!isValidStatus(normalizedStatus)) {
            throw new IllegalArgumentException(
                "Invalid status: " + status + ". Valid statuses: PENDING, SHIPPED, DELIVERED, CANCELLED"
            );
        }
    }

    /**
     * Check if status is valid
     */
    private boolean isValidStatus(String status) {
        return status.equals("PENDING") ||
               status.equals("SHIPPED") ||
               status.equals("DELIVERED") ||
               status.equals("CANCELLED");
    }
}

