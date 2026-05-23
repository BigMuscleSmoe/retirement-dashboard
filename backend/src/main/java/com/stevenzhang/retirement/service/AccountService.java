package com.stevenzhang.retirement.service;

import com.stevenzhang.retirement.dto.ContributionSummary;
import com.stevenzhang.retirement.dto.CreateContributionRequest;
import com.stevenzhang.retirement.entity.*;
import com.stevenzhang.retirement.exception.ResourceNotFoundException;
import com.stevenzhang.retirement.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private static final BigDecimal IRS_LIMIT_2025 = new BigDecimal("23500");

    private final AccountRepository accountRepository;
    private final ContributionRepository contributionRepository;
    private final BalanceHistoryRepository balanceHistoryRepository;
    private final AssetAllocationRepository assetAllocationRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository,
                          ContributionRepository contributionRepository,
                          BalanceHistoryRepository balanceHistoryRepository,
                          AssetAllocationRepository assetAllocationRepository,
                          UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.contributionRepository = contributionRepository;
        this.balanceHistoryRepository = balanceHistoryRepository;
        this.assetAllocationRepository = assetAllocationRepository;
        this.userRepository = userRepository;
    }

    public List<Account> getAccountsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return accountRepository.findByUserId(user.getId());
    }

    public Account getAccountForUser(UUID accountId, String email) {
        return accountRepository.findByIdAndUserEmail(accountId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }

    public Page<Contribution> getContributions(UUID accountId, String email, int page, int size) {
        getAccountForUser(accountId, email);
        return contributionRepository.findByAccountIdOrderByContributionDateDesc(
                accountId, PageRequest.of(page, size));
    }

    @Transactional
    public Contribution createContribution(UUID accountId, String email, CreateContributionRequest request) {
        Account account = getAccountForUser(accountId, email);
        Contribution contribution = new Contribution();
        contribution.setAccount(account);
        contribution.setContributionDate(request.contributionDate());
        contribution.setEmployeeAmount(request.employeeAmount());
        contribution.setEmployerAmount(request.employerAmount());
        contribution.setPayPeriod(request.payPeriod());
        Contribution saved = contributionRepository.save(contribution);

        BigDecimal total = request.employeeAmount().add(request.employerAmount());
        account.setCurrentBalance(account.getCurrentBalance().add(total));
        accountRepository.save(account);

        BalanceHistory record = new BalanceHistory();
        record.setAccount(account);
        record.setRecordDate(request.contributionDate());
        record.setBalance(account.getCurrentBalance());
        balanceHistoryRepository.save(record);

        return saved;
    }

    public ContributionSummary getContributionSummary(UUID accountId, String email) {
        getAccountForUser(accountId, email);
        LocalDate yearStart = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        BigDecimal employeeTotal = contributionRepository.sumEmployeeAmountSince(accountId, yearStart);
        BigDecimal employerTotal = contributionRepository.sumEmployerAmountSince(accountId, yearStart);
        BigDecimal ytdTotal = employeeTotal.add(employerTotal);
        BigDecimal remaining = IRS_LIMIT_2025.subtract(employeeTotal).max(BigDecimal.ZERO);
        return new ContributionSummary(employeeTotal, employerTotal, ytdTotal, IRS_LIMIT_2025, remaining);
    }

    public List<BalanceHistory> getBalanceHistory(UUID accountId, String email) {
        getAccountForUser(accountId, email);
        return balanceHistoryRepository.findByAccountIdOrderByRecordDateAsc(accountId);
    }

    public List<AssetAllocation> getAssetAllocation(UUID accountId, String email) {
        getAccountForUser(accountId, email);
        return assetAllocationRepository.findByAccountIdOrderByAsOfDateDesc(accountId);
    }
}
