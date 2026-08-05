package kr.go.support.subsidy.domain.log;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RequestLog {
    @Id
    @Column(name = "request_id", length = 36)
    private String requestId;

    @Column(name = "request_time", nullable = false, updatable = false)
    private LocalDateTime requestTime;

    @Column(name = "api_url", nullable = false)
    private String apiUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
