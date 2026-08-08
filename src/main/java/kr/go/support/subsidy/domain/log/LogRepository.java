package kr.go.support.subsidy.domain.log;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, String> {
    boolean existsByRequestId(String requestId);
}