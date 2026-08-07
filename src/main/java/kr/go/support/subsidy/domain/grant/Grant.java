package kr.go.support.subsidy.domain.grant;

import kr.go.support.subsidy.common.BaseEntity;
import jakarta.persistence.*;
import kr.go.support.subsidy.dto.grant.GrantUpdateDto;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "grants")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE grants SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Grant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grant_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrantCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrantCycle cycle;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrantStatus status;

    public void StatusUpdate(GrantStatus status){
        this.status = status;
    }

    public void Update(GrantUpdateDto dto){
        this.category = dto.category();
        this.title = dto.title();
        this.content = dto.content();
        this.amount = dto.amount();
        this.cycle = dto.cycle();
        this.startDate = dto.startDate();
        this.endDate = dto.endDate();
    }
}