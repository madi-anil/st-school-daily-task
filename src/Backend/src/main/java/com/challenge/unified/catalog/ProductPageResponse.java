package com.challenge.unified.catalog;

import java.util.List;

public record ProductPageResponse(
        List<Product> items,
        int page,
        int size,
        long totalItems,
        int totalPages,
        boolean hasNext,
        boolean hasPrev
) {}
