package com.challenge.unified.expenses.dto;

import java.math.BigDecimal;

public record ExpenseRequest(
        String title,
        BigDecimal amount,
        String category,
        String date
) {}