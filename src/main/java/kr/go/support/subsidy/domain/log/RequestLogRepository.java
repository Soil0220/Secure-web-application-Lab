package kr.go.support.subsidy.domain.log;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestLogRepository extends JpaRepository<RequestLog, String> {
    boolean existsByRequestId(String requestId);
}