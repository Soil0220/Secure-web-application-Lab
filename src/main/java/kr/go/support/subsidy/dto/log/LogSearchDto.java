package kr.go.support.subsidy.dto.log;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.log.Log;

import java.time.Instant;

public record LogSearchDto(
        @NotNull
        @Size(max = 500)
        String apiUrl
) {}