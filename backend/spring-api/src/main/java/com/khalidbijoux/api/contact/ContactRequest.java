package com.khalidbijoux.api.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonAlias;

public record ContactRequest(
        @NotBlank(message = "name is required")
        @JsonAlias("fullName") String name,
        @Email(message = "email must be valid")
        @NotBlank(message = "email is required")
        String email,
        @NotBlank(message = "subject is required")
        String subject,
        @NotBlank(message = "message is required")
        String message
) {
}
