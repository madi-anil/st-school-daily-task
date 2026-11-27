package com.challenge.unified.expenses.dto;

import java.math.BigDecimal;
import java.util.List;

public record SummaryResponse(
        BigDecimal total,
        List<CategorySummary> byCategory
) {}