package com.khalidbijoux.api.chat;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank(message = "message is required")
        String message
) {
}
