package com.stevenzhang.retirement.repository;

import com.stevenzhang.retirement.entity.Contribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public interface ContributionRepository extends JpaRepository<Contribution, UUID> {
    Page<Contribution> findByAccountIdOrderByContributionDateDesc(UUID accountId, Pageable pageable);

    Page<Contribution> findByAccountIdAndContributionDateBetweenOrderByContributionDateDesc(
            UUID accountId, LocalDate start, LocalDate end, Pageable pageable);

    @Query("SELECT COALESCE(SUM(c.employeeAmount), 0) FROM Contribution c " +
           "WHERE c.account.id = :accountId AND c.contributionDate >= :startDate")
    BigDecimal sumEmployeeAmountSince(@Param("accountId") UUID accountId, @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(c.employerAmount), 0) FROM Contribution c " +
           "WHERE c.account.id = :accountId AND c.contributionDate >= :startDate")
    BigDecimal sumEmployerAmountSince(@Param("accountId") UUID accountId, @Param("startDate") LocalDate startDate);
}
