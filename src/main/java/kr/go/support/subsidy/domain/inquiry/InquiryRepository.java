package kr.go.support.subsidy.domain.inquiry;

import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByUserId(Long userId);
    Optional<Inquiry> findByIdAndUserId(Long inquiryId, Long userId);
    @Query("select a from Inquiry a join fetch a.user")
    List<Inquiry> findAllWithUser();
    @Query("select a from Inquiry a join fetch a.user where a.user.id = :userId")
    List<Inquiry> findByUserIdWithUser(@Param("userId") Long userId);
}