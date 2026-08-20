package com.khalidbijoux.api.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank @Pattern(regexp = "\\d{6}", message = "OTP must contain exactly 6 digits") String otp,
        @NotBlank @Size(min = 8, max = 72, message = "Password must contain between 8 and 72 characters") String newPassword,
        @NotBlank String confirmPassword
) {
}
