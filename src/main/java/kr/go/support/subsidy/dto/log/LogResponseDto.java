package kr.go.support.subsidy.dto.log;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.log.Log;
import kr.go.support.subsidy.dto.inquiry.InquiryResponseDto;

import java.time.Instant;

public record LogResponseDto(
        @NotBlank
        Instant requestTime, // ISO-8601 형식 문자열

        @NotNull
        @Size(max = 500)
        String apiUrl
) {
        public static LogResponseDto from(Log log){
                return new LogResponseDto(
                        log.getRequestTime(),
                        log.getApiUrl()
                );
        }
}
