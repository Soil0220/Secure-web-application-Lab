package kr.go.support.subsidy.domain.log;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {
    boolean existsByRequestId(String requestId);
    List<Log> findByApiUrlContainingIgnoreCase(String keyword);
}