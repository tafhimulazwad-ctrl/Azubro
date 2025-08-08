package com.bookexchange.repository;

import com.bookexchange.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
    List<ExchangeRequest> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<ExchangeRequest> findByStatusOrderByCreatedAtDesc(ExchangeRequest.ExchangeStatus status);
}
