package com.devsystem.erp.repositories;

import com.devsystem.erp.models.SealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SealLogRepository extends JpaRepository<SealLog, Long> {
}
