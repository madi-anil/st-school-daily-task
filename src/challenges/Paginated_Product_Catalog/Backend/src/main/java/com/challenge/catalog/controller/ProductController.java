package com.challenge.catalog.controller;

import com.challenge.catalog.dto.ProductPageResponse;
import com.challenge.catalog.model.Product;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final List<Product> products = new ArrayList<>();

    @PostConstruct
    public void initProducts() {
        String[] categories = {"Electronics", "Accessories", "Audio", "Wearables"};
        String[][] namesByCategory = {
                {"Smart Phone", "Wireless Router", "4K Monitor", "Mechanical Keyboard", "Gaming Mouse"},
                {"Phone Case", "USB-C Hub", "Laptop Stand", "Fast Charger", "Screen Protector"},
                {"Bluetooth Speaker", "Noise Cancelling Headphones", "Studio Mic", "Earbuds Pro", "Soundbar"},
                {"Fitness Watch", "Smart Band", "Sport Tracker", "Smart Ring", "GPS Watch"}
        };

        Random random = new Random(42);
        for (int i = 1; i <= 100; i++) {
            int catIdx = (i - 1) % categories.length;
            String category = categories[catIdx];
            String baseName = namesByCategory[catIdx][random.nextInt(namesByCategory[catIdx].length)];
            String name = baseName + " " + i;
            int price = 100 + random.nextInt(4901); // 100 to 5000 inclusive
            products.add(new Product(i, name, category, price));
        }
    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "") String category
    ) {
        if (page < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "page must be 1 or more"));
        }
        if (size < 1 || size > 50) {
            return ResponseEntity.badRequest().body(Map.of("error", "size must be between 1 and 50"));
        }

        Comparator<Product> comparator = switch (sort) {
            case "id" -> Comparator.comparingInt(Product::id);
            case "price_asc" -> Comparator.comparingInt(Product::price).thenComparingInt(Product::id);
            case "price_desc" -> Comparator.comparingInt(Product::price).reversed().thenComparingInt(Product::id);
            case "name" -> Comparator.comparing(Product::name, String.CASE_INSENSITIVE_ORDER);
            default -> null;
        };

        if (comparator == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "sort must be one of id, price_asc, price_desc, name"));
        }

        String queryLower = q.trim().toLowerCase();
        String categoryTrimmed = category.trim();

        // 1. Filter by q (and optional category)
        List<Product> filtered = products.stream()
                .filter(p -> queryLower.isEmpty() || p.name().toLowerCase().contains(queryLower))
                .filter(p -> categoryTrimmed.isEmpty() || p.category().equalsIgnoreCase(categoryTrimmed))
                .sorted(comparator) // 2. Sort
                .toList();

        long total = filtered.size();
        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / size);

        // 3. Page
        int offset = (page - 1) * size;
        List<Product> items = offset >= total
                ? List.of()
                : filtered.stream().skip(offset).limit(size).toList();

        return ResponseEntity.ok(new ProductPageResponse(items, page, size, total, totalPages));
    }
}