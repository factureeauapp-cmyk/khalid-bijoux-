package com.khalidbijoux.api.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "{auth.email.required}")
        @Email(message = "{auth.email.invalid}")
        String email,
        
        @NotBlank(message = "{auth.password.required}")
        String password
) {}