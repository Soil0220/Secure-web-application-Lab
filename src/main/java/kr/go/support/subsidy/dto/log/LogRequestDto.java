package kr.go.support.subsidy.dto.log;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.log.Log;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record LogRequestDto(
        @NotBlank
        String requestId,
        @NotBlank
        String requestTime, // ISO-8601 형식 문자열
        @NotNull
        @Size(max = 500)
        String apiUrl
) {
    public Log toEntity() {
        LocalDateTime parsedRequestTime = OffsetDateTime.parse(requestTime).toLocalDateTime();

        return Log.builder()
                .requestId(requestId)
                .requestTime(parsedRequestTime)
                .apiUrl(apiUrl)
                .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                .build();
    }
}