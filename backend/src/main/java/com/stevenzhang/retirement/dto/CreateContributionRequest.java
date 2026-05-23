package com.stevenzhang.retirement.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateContributionRequest(
    @NotNull LocalDate contributionDate,
    @NotNull @DecimalMin("0.01") BigDecimal employeeAmount,
    @NotNull @DecimalMin("0.00") BigDecimal employerAmount,
    @NotNull @Pattern(regexp = "BIWEEKLY|MONTHLY|WEEKLY") String payPeriod
) {}
