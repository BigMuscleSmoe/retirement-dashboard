package com.stevenzhang.retirement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "contributions")
public class Contribution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "contribution_date", nullable = false)
    private LocalDate contributionDate;

    @Column(name = "employee_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal employeeAmount;

    @Column(name = "employer_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal employerAmount;

    @Column(name = "pay_period", length = 20)
    private String payPeriod;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
    public LocalDate getContributionDate() { return contributionDate; }
    public void setContributionDate(LocalDate contributionDate) { this.contributionDate = contributionDate; }
    public BigDecimal getEmployeeAmount() { return employeeAmount; }
    public void setEmployeeAmount(BigDecimal employeeAmount) { this.employeeAmount = employeeAmount; }
    public BigDecimal getEmployerAmount() { return employerAmount; }
    public void setEmployerAmount(BigDecimal employerAmount) { this.employerAmount = employerAmount; }
    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
}
