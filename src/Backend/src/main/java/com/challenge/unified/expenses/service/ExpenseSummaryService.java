package com.challenge.unified.expenses.service;

import com.challenge.unified.expenses.dto.CategorySummary;
import com.challenge.unified.expenses.dto.SummaryResponse;
import com.challenge.unified.expenses.model.Expense;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseSummaryService {

    public BigDecimal roundMoney(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    public SummaryResponse buildSummary(List<Expense> expenses) {
        BigDecimal grandTotal = expenses.stream()
                .map(Expense::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, List<Expense>> grouped = expenses.stream()
                .collect(Collectors.groupingBy(Expense::category));

        List<CategorySummary> byCategory = grouped.entrySet().stream()
                .filter(entry -> !entry.getValue().isEmpty())
                .map(entry -> {
                    BigDecimal catTotal = entry.getValue().stream()
                            .map(Expense::amount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new CategorySummary(
                            entry.getKey(),
                            roundMoney(catTotal),
                            entry.getValue().size()
                    );
                })
                .sorted(Comparator.comparing(CategorySummary::total).reversed()
                        .thenComparing(CategorySummary::category))
                .toList();

        return new SummaryResponse(roundMoney(grandTotal), byCategory);
    }
}