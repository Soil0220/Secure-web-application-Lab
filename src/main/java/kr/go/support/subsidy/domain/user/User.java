package kr.go.support.subsidy.domain.user;

import jakarta.persistence.*;
import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.common.BaseTimeEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 50)
    private String bankName;

    @Column(length = 20)
    private String accountNum;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // 계좌 변경 전용 메서드
    public void updateAccount(String bankName, String accountNum) {
        this.bankName = bankName;
        this.accountNum = accountNum;
    }
}
