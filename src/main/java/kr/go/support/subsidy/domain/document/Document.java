package kr.go.support.subsidy.domain.document;

import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "user_documents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE user_documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Document extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private DocumentType docType;

    @Column(nullable = false, length = 100)
    private String originFileName;

    @Column(nullable = false, length = 100)
    private String storeFileName;

    @Column(nullable = false)
    private Long fileSize;
}