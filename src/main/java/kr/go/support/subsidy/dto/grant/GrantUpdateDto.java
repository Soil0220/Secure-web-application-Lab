package kr.go.support.subsidy.dto.grant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.grant.GrantCategory;
import kr.go.support.subsidy.domain.grant.GrantCycle;
import kr.go.support.subsidy.domain.grant.GrantStatus;

import java.time.LocalDate;

public record GrantUpdateDto(

        @NotNull
        GrantCategory category,

        @NotBlank
        @Size(max = 200)
        String title,

        @NotBlank
        String content,

        @NotNull
        @PositiveOrZero
        Long amount,

        @NotNull
        GrantCycle cycle,

        @NotNull
        LocalDate startDate,

        @NotNull
        LocalDate endDate
) {}