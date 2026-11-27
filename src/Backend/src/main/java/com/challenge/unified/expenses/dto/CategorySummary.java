package com.challenge.unified.expenses.dto;

import java.math.BigDecimal;

public record CategorySummary(
        String category,
        BigDecimal total,
        int count
) {}