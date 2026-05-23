package com.stevenzhang.retirement.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProjectionResponse(
    BigDecimal projectedBalance,
    BigDecimal estimatedMonthlyIncome,
    List<YearProjection> yearByYear
) {
    public record YearProjection(int age, BigDecimal balance) {}
}
