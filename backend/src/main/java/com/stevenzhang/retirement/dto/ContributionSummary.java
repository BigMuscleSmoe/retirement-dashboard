package com.stevenzhang.retirement.dto;

import java.math.BigDecimal;

public record ContributionSummary(
    BigDecimal ytdEmployeeTotal,
    BigDecimal ytdEmployerTotal,
    BigDecimal ytdTotal,
    BigDecimal irsLimit,
    BigDecimal remainingAllowance
) {}
