package com.devsystem.erp.repositories;

import com.devsystem.erp.models.WashingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface WashingServiceRepository extends JpaRepository<WashingService, Long> {
    List<WashingService> findByDateBetween(LocalDate startDate, LocalDate endDate );
}
