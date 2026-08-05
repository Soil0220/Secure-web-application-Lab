package kr.go.support.subsidy.domain.inquiry;

import kr.go.support.subsidy.domain.inquiry.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByUserId(Long userId);
    Optional<Inquiry> findByIdAndUserId(Long inquiryId, Long userId);
}