package com.challenge.catalog.dto;

import com.challenge.catalog.model.Product;
import java.util.List;

public record ProductPageResponse(
        List<Product> items,
        int page,
        int size,
        long total,
        int totalPages
) {}