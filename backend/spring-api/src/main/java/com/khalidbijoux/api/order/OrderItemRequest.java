package com.khalidbijoux.api.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderItemRequest(

        @NotBlank(message = "productId is required")
        String productId,

        @NotNull(message = "quantity is required")
        @Min(value = 1, message = "quantity must be at least 1")
        Integer quantity,

        @Valid
        List<SelectedAttributeRequest> selectedAttributes

) {
}