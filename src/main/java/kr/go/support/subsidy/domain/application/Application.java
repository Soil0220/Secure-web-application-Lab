package kr.go.support.subsidy.domain.application;

import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocument;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "grant_id", "active_flag"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE user_applications SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Application extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grant_id", nullable = false)
    private Grant grant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    //applicationDocument 접근 조회용 필드
    @OneToMany(mappedBy = "application")
    private List<ApplicationDocument> documents = new ArrayList<>();

    //소프트 딜리트 시 userId와 grantId의 중복방지를 유지하기 위한 DB 가상 컬럼 설정(삭제 시점에 NULL값이 자동으로 들어감)
    @Column(columnDefinition = "BIGINT GENERATED ALWAYS AS (IF(deleted_at IS NULL, 0, NULL)) STORED",
            name = "active_flag",
            insertable = false,
            updatable = false
    )
    private Long activeFlag;

    public void updateApplicationStatus(ApplicationStatus status){
        this.status = status;
    }

    public static Application toEntity(User user, Grant grant) {
        return Application.builder()
                .user(user)
                .grant(grant)
                .status(ApplicationStatus.SUBMITTED)
                .build();
    }
}