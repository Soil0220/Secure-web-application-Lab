package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ApplicationCreateDto (
        @NotNull
        Long grantId,
        @NotEmpty
        List<Long> documentIds
){}
