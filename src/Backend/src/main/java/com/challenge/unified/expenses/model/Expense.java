package com.challenge.unified.expenses.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Expense(
        long id,
        String title,
        BigDecimal amount,
        String category,
        LocalDate date
) {}