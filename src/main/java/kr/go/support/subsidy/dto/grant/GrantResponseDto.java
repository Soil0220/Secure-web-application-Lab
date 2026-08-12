package kr.go.support.subsidy.dto.grant;


import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantCategory;
import kr.go.support.subsidy.domain.grant.GrantCycle;
import kr.go.support.subsidy.domain.grant.GrantStatus;

import java.time.Instant;
import java.time.LocalDate;

public record GrantResponseDto (
        Long grantId,
        GrantCategory category,
        String title,
        String content,
        Long amount,
        GrantCycle cycle,
        Instant startDate,
        Instant endDate,
        GrantStatus status
){
    public static GrantResponseDto from(Grant grant){
        return new GrantResponseDto(
                grant.getId(),
                grant.getCategory(),
                grant.getTitle(),
                grant.getContent(),
                grant.getAmount(),
                grant.getCycle(),
                grant.getStartDate(),
                grant.getEndDate(),
                grant.getStatus()
        );
    }
}
