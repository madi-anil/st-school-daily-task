package com.challenge.backend.dto;

public record RegisterResponse(
        Long id,
        String name,
        String email
) {}