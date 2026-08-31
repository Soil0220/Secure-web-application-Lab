package kr.go.support.subsidy.domain.application;

import kr.go.support.subsidy.domain.application.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    Optional<Application> findByIdAndUserId(Long applicationId, Long userId);
    List<Application> findByGrantId(Long grantId);
    @Query("select a from Application a join fetch a.user join fetch a.grant")
    List<Application> findAllWithUserAndGrant();
}
