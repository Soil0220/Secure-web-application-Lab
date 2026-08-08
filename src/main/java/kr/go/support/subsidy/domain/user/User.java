package kr.go.support.subsidy.domain.user;

import jakarta.persistence.*;
import kr.go.support.subsidy.common.BaseEntity;
import kr.go.support.subsidy.common.BaseTimeEntity;
import kr.go.support.subsidy.dto.user.UserJoinDto;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

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

    @Column(nullable = false, unique = true, length = 100)
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

    //계정 삭제 전용 메서드(기존 이메일 마스킹처리)
    @Override
    public void delete(){
        super.delete();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString();
        String mask = String.format("deleted_%s_%s", timestamp, uuid);
        System.out.println(mask);
        this.username = mask;
        this.email = mask;
    }

    /* 계정 복구 메서드
    public void restore(UserJoinDto dto){
        super.restore();
        this.name = dto.username();
        this.password = dto.password();
        this.phone = dto.phone();
    }
     */
    }
