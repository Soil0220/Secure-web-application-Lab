package kr.go.support.subsidy.domain.favorite;

import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "user_favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "grant_id", "active_flag"}) // 중복 즐겨찾기 방지
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE user_favorites SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Favorite extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grant_id", nullable = false)
    private Grant grant;

    //소프트 딜리트 시 userId와 grantId의 중복방지를 유지하기 위한 DB 가상 컬럼 설정(삭제 시점에 NULL값이 자동으로 들어감)
    @Column(columnDefinition = "BIGINT GENERATED ALWAYS AS (IF(deleted_at IS NULL, 0, NULL)) STORED",
            name = "active_flag",
            insertable = false,
            updatable = false
    )
    private Long activeFlag;

    public static Favorite toEntity(User user, Grant grant) {
        return Favorite.builder()
                .user(user)
                .grant(grant)
                .build();
    }
}