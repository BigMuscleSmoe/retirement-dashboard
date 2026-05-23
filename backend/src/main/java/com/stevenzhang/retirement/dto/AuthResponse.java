package com.stevenzhang.retirement.dto;

public record AuthResponse(
    String token,
    String refreshToken,
    String email,
    String fullName,
    String role
) {}
