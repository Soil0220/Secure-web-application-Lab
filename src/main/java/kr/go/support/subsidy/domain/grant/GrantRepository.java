package kr.go.support.subsidy.domain.grant;

import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrantRepository extends JpaRepository<Grant, Long> {
    List<Grant> findByStatus(GrantStatus status);
}

//지원제도 등록, 제거, 상태갱신