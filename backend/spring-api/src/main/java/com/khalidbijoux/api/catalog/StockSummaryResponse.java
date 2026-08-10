package com.khalidbijoux.api.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockSummaryResponse {
    private long totalProducts;
    private long availableProducts;
    private long outOfStockProducts;
    private long totalQuantity;
    private long totalValue;
}
