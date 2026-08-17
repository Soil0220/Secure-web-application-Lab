package kr.go.support.subsidy.domain.applicationDocument;

import kr.go.support.subsidy.domain.document.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByUserId(Long userId);
    Optional<ApplicationDocument> findByIdAndUserId(Long id, Long userId);
}
