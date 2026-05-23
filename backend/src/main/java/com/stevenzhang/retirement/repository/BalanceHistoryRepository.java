package com.stevenzhang.retirement.repository;

import com.stevenzhang.retirement.entity.BalanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BalanceHistoryRepository extends JpaRepository<BalanceHistory, UUID> {
    List<BalanceHistory> findByAccountIdOrderByRecordDateAsc(UUID accountId);
}
