package kr.go.support.subsidy.dto.log;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.log.Log;

import java.time.Instant;
import java.time.LocalDateTime;

public record LogRequestDto(
        @NotBlank
        String requestId,
        @NotBlank
        Instant requestTime, // ISO-8601 형식 문자열
        @NotNull
        @Size(max = 500)
        String apiUrl
) {
    public Log toEntity() {

        return Log.builder()
                .requestId(requestId)
                .requestTime(requestTime)
                .apiUrl(apiUrl)
                .createdAt(Instant.now())
                .build();
    }
}