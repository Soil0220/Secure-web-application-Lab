package kr.go.support.subsidy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.log.RequestLog;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record RequestLogDto(
        @NotBlank
        String requestId,
        @NotBlank
        String requestTime, // ISO-8601 형식 문자열
        @NotNull
        @Size(max = 500)
        String apiUrl
) {
    public RequestLog toEntity() {
        LocalDateTime parsedRequestTime = OffsetDateTime.parse(requestTime).toLocalDateTime();

        return RequestLog.builder()
                .requestId(requestId)
                .requestTime(parsedRequestTime)
                .apiUrl(apiUrl)
                .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                .build();
    }
}