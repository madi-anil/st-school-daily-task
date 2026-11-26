package com.challenge.unified.catalog;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final List<Product> PRODUCTS = generateProducts();

    private static List<Product> generateProducts() {
        String[] categories = {"Electronics", "Audio", "Accessories", "Home", "Fitness"};
        String[] prefixes = {"Pro", "Ultra", "Smart", "Compact", "Wireless", "Studio", "Eco", "Max", "Air", "Lite"};
        String[] items = {"Headphones", "Keyboard", "Monitor", "Speaker", "Watch", "Charger", "Lamp", "Tracker", "Mouse", "Stand"};

        return IntStream.rangeClosed(1, 100)
                .mapToObj(i -> {
                    String name = prefixes[(i - 1) % prefixes.length] + " " + items[((i - 1) / 10) % items.length] + " " + i;
                    String category = categories[(i - 1) % categories.length];
                    double price = Math.round((19.99 + ((i * 17) % 280)) * 100.0) / 100.0;
                    return new Product(i, name, category, price);
                })
                .toList();
    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "") String sort
    ) {
        if (page < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "page must be 1 or more"));
        }
        if (size < 1 || size > 50) {
            return ResponseEntity.badRequest().body(Map.of("error", "size must be between 1 and 50"));
        }

        String query = q.trim().toLowerCase();
        String cat = category.trim().toLowerCase();

        List<Product> filtered = new ArrayList<>(PRODUCTS.stream()
                .filter(p -> query.isEmpty() || p.name().toLowerCase().contains(query))
                .filter(p -> cat.isEmpty() || p.category().toLowerCase().equals(cat))
                .toList());

        switch (sort) {
            case "price_asc" -> filtered.sort(Comparator.comparingDouble(Product::price));
            case "price_desc" -> filtered.sort(Comparator.comparingDouble(Product::price).reversed());
            case "name_asc" -> filtered.sort(Comparator.comparing(Product::name));
            default -> filtered.sort(Comparator.comparingInt(Product::id));
        }

        long totalItems = filtered.size();
        int totalPages = totalItems == 0 ? 0 : (int) Math.ceil((double) totalItems / size);
        int fromIndex = Math.min((page - 1) * size, filtered.size());
        int toIndex = Math.min(fromIndex + size, filtered.size());
        List<Product> pageItems = filtered.subList(fromIndex, toIndex);

        return ResponseEntity.ok(new ProductPageResponse(
                pageItems,
                page,
                size,
                totalItems,
                totalPages,
                page < totalPages,
                page > 1 && totalPages > 0
        ));
    }
}
