package com.stevenzhang.retirement.repository;

import com.stevenzhang.retirement.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUserId(UUID userId);

    @Query("SELECT a FROM Account a JOIN a.user u WHERE a.id = :accountId AND u.email = :email")
    Optional<Account> findByIdAndUserEmail(@Param("accountId") UUID accountId, @Param("email") String email);
}
