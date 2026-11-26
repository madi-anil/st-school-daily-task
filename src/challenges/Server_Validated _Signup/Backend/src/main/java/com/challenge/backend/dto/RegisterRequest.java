package com.challenge.backend.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[A-Z]).{8,}$",
                message = "Password must be at least 8 characters with 1 uppercase letter and 1 digit"
        )
        String password,

        @NotNull(message = "Age is required")
        @Min(value = 18, message = "Age must be between 18 and 100")
        @Max(value = 100, message = "Age must be between 18 and 100")
        Integer age
) {}