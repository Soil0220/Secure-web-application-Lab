package kr.go.support.subsidy.domain.application;

import kr.go.support.subsidy.domain.application.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    Optional<Application> findByUserIdAndGrantId(Long userId, Long grantId);
}
