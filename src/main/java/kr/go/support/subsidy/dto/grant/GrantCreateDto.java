package kr.go.support.subsidy.dto.grant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantCategory;
import kr.go.support.subsidy.domain.grant.GrantCycle;
import kr.go.support.subsidy.domain.grant.GrantStatus;

import java.time.Instant;
import java.time.LocalDate;

public record GrantCreateDto(
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
        Instant startDate,

        @NotNull
        Instant endDate,

        @NotNull
        GrantStatus status
) {
        public Grant toEntity() {
                return Grant.builder()
                        .category(category)
                        .title(title)
                        .content(content)
                        .amount(amount)
                        .cycle(cycle)
                        .startDate(startDate)
                        .endDate(endDate)
                        .status(status)
                        .build();
        }
}

