package kr.go.support.subsidy.dto;

import kr.go.support.subsidy.domain.log.RequestLog;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record RequestLogDto(
        String requestId,
        String requestTime, // ISO-8601 형식 문자열 (예: "2026-08-01T10:21:40.000Z")
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