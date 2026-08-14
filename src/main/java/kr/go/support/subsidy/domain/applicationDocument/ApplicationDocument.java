package kr.go.support.subsidy.domain.applicationDocument;

import jakarta.persistence.*;
import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentType;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.user.User;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "application_documents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE application_documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ApplicationDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_document_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    //Document 엔티티의 스냅샷 용 필드
    @Column(nullable = false)
    private DocumentType docType;

    @Column(nullable = false, length = 100)
    private String originFileName;

    @Column(nullable = false, length = 100)
    private String storeFileName;

    @Column(nullable = false)
    private Long fileSize;

    //Document는 유저별 서류 보관 테이블이기에 삭제 등이 자유롭게 이루어질 수 있도록 직접 참조가 아닌 스냅샷 방식 이용
    public static ApplicationDocument toEntity(User user, Application application, Document document) {
        return ApplicationDocument.builder()
                .user(user)
                .application(application)
                .docType(document.getDocType())
                .originFileName(document.getOriginFileName())
                .storeFileName(document.getStoreFileName())
                .fileSize(document.getFileSize())
                .build();
    }

}
