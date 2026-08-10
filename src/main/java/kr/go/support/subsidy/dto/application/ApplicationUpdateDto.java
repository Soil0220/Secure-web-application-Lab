package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.application.ApplicationStatus;

public record ApplicationUpdateDto (
        @NotNull
        ApplicationStatus status
) {}
