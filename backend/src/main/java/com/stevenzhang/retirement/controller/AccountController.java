package com.stevenzhang.retirement.controller;

import com.stevenzhang.retirement.dto.ContributionSummary;
import com.stevenzhang.retirement.dto.CreateContributionRequest;
import com.stevenzhang.retirement.entity.Account;
import com.stevenzhang.retirement.entity.AssetAllocation;
import com.stevenzhang.retirement.entity.BalanceHistory;
import com.stevenzhang.retirement.entity.Contribution;
import com.stevenzhang.retirement.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts(Authentication auth) {
        return ResponseEntity.ok(accountService.getAccountsForUser(auth.getName()));
    }

    @GetMapping("/{accountId}/contributions")
    public ResponseEntity<Page<Contribution>> getContributions(
            @PathVariable UUID accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        return ResponseEntity.ok(accountService.getContributions(accountId, auth.getName(), page, size));
    }

    @PostMapping("/{accountId}/contributions")
    public ResponseEntity<Contribution> createContribution(
            @PathVariable UUID accountId,
            @Valid @RequestBody CreateContributionRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accountService.createContribution(accountId, auth.getName(), request));
    }

    @GetMapping("/{accountId}/contributions/summary")
    public ResponseEntity<ContributionSummary> getContributionSummary(
            @PathVariable UUID accountId, Authentication auth) {
        return ResponseEntity.ok(accountService.getContributionSummary(accountId, auth.getName()));
    }

    @GetMapping("/{accountId}/balance-history")
    public ResponseEntity<List<BalanceHistory>> getBalanceHistory(
            @PathVariable UUID accountId, Authentication auth) {
        return ResponseEntity.ok(accountService.getBalanceHistory(accountId, auth.getName()));
    }

    @GetMapping("/{accountId}/asset-allocation")
    public ResponseEntity<List<AssetAllocation>> getAssetAllocation(
            @PathVariable UUID accountId, Authentication auth) {
        return ResponseEntity.ok(accountService.getAssetAllocation(accountId, auth.getName()));
    }
}
