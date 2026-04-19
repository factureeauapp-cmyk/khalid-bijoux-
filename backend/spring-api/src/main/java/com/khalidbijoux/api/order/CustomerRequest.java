package com.khalidbijoux.api.order;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerRequest(
        @NotBlank(message = "firstName is required")
        String firstName,
        @NotBlank(message = "lastName is required")
        String lastName,
        @NotBlank(message = "phoneNumber is required")
        String phoneNumber,
        @Email(message = "email must be valid")
        @NotBlank(message = "email is required")
        String email
) {
}
