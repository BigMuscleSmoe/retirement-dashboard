package com.stevenzhang.retirement.repository;

import com.stevenzhang.retirement.entity.AssetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, UUID> {
    List<AssetAllocation> findByAccountIdOrderByAsOfDateDesc(UUID accountId);
}
