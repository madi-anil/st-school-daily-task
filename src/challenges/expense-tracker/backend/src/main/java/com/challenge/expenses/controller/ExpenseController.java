package com.challenge.unified.expenses.controller;

import com.challenge.unified.expenses.dto.ExpenseRequest;
import com.challenge.unified.expenses.dto.SummaryResponse;
import com.challenge.unified.expenses.model.Expense;
import com.challenge.unified.expenses.service.ExpenseSummaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://st-school-daily-task.vercel.app"
})
public class ExpenseController {

    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "Food", "Travel", "Bills", "Shopping", "Other"
    );

    private final List<Expense> expenses = new CopyOnWriteArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final ExpenseSummaryService summaryService;

    public ExpenseController(ExpenseSummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping("/expenses")
    public List<Expense> getExpenses() {
        return expenses.stream()
                .sorted(Comparator.comparing(Expense::date).reversed()
                        .thenComparing(Comparator.comparingLong(Expense::id).reversed()))
                .toList();
    }

    @PostMapping("/expenses")
    public ResponseEntity<?> createExpense(@RequestBody ExpenseRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (req == null || req.title() == null || req.title().isBlank()) {
            errors.put("title", "Title is required");
        }

        if (req == null || req.amount() == null) {
            errors.put("amount", "Must be greater than 0");
        } else {
            if (req.amount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.put("amount", "Must be greater than 0");
            } else if (req.amount().scale() > 2) {
                errors.put("amount", "At most 2 decimal places allowed");
            }
        }

        if (req == null || req.category() == null || !ALLOWED_CATEGORIES.contains(req.category())) {
            errors.put("category", "Must be one of Food, Travel, Bills, Shopping, Other");
        }

        LocalDate parsedDate = null;
        if (req == null || req.date() == null || req.date().isBlank()) {
            errors.put("date", "Date is required (YYYY-MM-DD)");
        } else {
            try {
                parsedDate = LocalDate.parse(req.date().trim());
                if (parsedDate.isAfter(LocalDate.now())) {
                    errors.put("date", "Date cannot be in the future");
                }
            } catch (DateTimeParseException ex) {
                errors.put("date", "Invalid date format, expected YYYY-MM-DD");
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        Expense created = new Expense(
                idGenerator.getAndIncrement(),
                req.title().trim(),
                summaryService.roundMoney(req.amount()),
                req.category(),
                parsedDate
        );
        expenses.add(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable long id) {
        boolean removed = expenses.removeIf(e -> e.id() == id);
        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Expense not found"));
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public SummaryResponse getSummary() {
        return summaryService.buildSummary(expenses);
    }
}