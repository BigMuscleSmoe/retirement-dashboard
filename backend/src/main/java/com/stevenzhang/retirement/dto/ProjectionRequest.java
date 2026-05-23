package com.stevenzhang.retirement.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProjectionRequest(
    @NotNull @Min(18) @Max(80) Integer currentAge,
    @NotNull @Min(50) @Max(80) Integer retirementAge,
    @NotNull @DecimalMin("0.0") @DecimalMax("20.0") BigDecimal expectedReturnRate,
    @NotNull @DecimalMin("0") BigDecimal annualContribution,
    @NotNull @DecimalMin("0") BigDecimal currentBalance
) {}
