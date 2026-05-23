package com.stevenzhang.retirement.service;

import com.stevenzhang.retirement.dto.ProjectionRequest;
import com.stevenzhang.retirement.dto.ProjectionResponse;
import com.stevenzhang.retirement.dto.ProjectionResponse.YearProjection;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectionService {

    private static final BigDecimal MONTHLY_WITHDRAWAL_RATE = new BigDecimal("0.04")
            .divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);

    public ProjectionResponse calculate(ProjectionRequest request) {
        int years = request.retirementAge() - request.currentAge();
        if (years <= 0) {
            throw new IllegalArgumentException("Retirement age must be greater than current age");
        }

        BigDecimal rate = request.expectedReturnRate().divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusRate = BigDecimal.ONE.add(rate);
        BigDecimal balance = request.currentBalance();
        List<YearProjection> projections = new ArrayList<>();
        projections.add(new YearProjection(request.currentAge(), balance.setScale(2, RoundingMode.HALF_UP)));

        for (int i = 1; i <= years; i++) {
            balance = balance.multiply(onePlusRate, MathContext.DECIMAL128)
                    .add(request.annualContribution());
            projections.add(new YearProjection(
                    request.currentAge() + i,
                    balance.setScale(2, RoundingMode.HALF_UP)));
        }

        BigDecimal finalBalance = balance.setScale(2, RoundingMode.HALF_UP);
        BigDecimal monthlyIncome = finalBalance.multiply(MONTHLY_WITHDRAWAL_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        return new ProjectionResponse(finalBalance, monthlyIncome, projections);
    }
}
