package com.challenge.expenses.dto;

import java.math.BigDecimal;

public record CategorySummary(
        String category,
        BigDecimal total,
        int count
) {}
