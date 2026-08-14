package kr.go.support.subsidy.domain.log;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Log {
    //TODO User참조, apiUrl에 메서드정보 추가 필요
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @Column(name = "request_id", length = 36)
    private String requestId;

    @Column(name = "request_time", nullable = false, updatable = false)
    private Instant requestTime;

    @Column(name = "api_url", nullable = false, length = 500)
    private String apiUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
