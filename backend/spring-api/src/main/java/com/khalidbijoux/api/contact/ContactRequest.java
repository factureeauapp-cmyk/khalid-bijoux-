package com.khalidbijoux.api.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
        @NotBlank(message = "fullName is required")
        String fullName,
        @Email(message = "email must be valid")
        @NotBlank(message = "email is required")
        String email,
        @NotBlank(message = "subject is required")
        String subject,
        @NotBlank(message = "message is required")
        String message
) {
}
